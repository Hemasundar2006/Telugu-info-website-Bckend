/**
 * Real-time Analytics Tracker
 * Automatically tracks page views, user events, and session data
 */

class AnalyticsTracker {
    constructor(config = {}) {
        this.config = {
            apiUrl: config.apiUrl || 'http://localhost:4000/api/analytics',
            websocketUrl: config.websocketUrl || 'http://localhost:4000',
            trackPageViews: config.trackPageViews !== false,
            trackEvents: config.trackEvents !== false,
            trackScrolling: config.trackScrolling !== false,
            trackClicks: config.trackClicks !== false,
            trackFormSubmissions: config.trackFormSubmissions !== false,
            sessionTimeout: config.sessionTimeout || 30, // minutes
            debug: config.debug || false,
            ...config
        };

        this.sessionId = null;
        this.userId = null;
        this.socket = null;
        this.pageStartTime = Date.now();
        this.isInitialized = false;
        this.eventQueue = [];
        this.scrollDepth = 0;
        this.maxScrollDepth = 0;

        this.init();
    }

    async init() {
        try {
            console.log('Initializing analytics tracker...');
            // Get or create session ID
            await this.initializeSession();
            
            // Initialize WebSocket connection
            if (typeof io !== 'undefined') {
                console.log('Socket.IO library found, initializing WebSocket...');
                this.initializeWebSocket();
            } else {
                console.error('Socket.IO library not found! Make sure to include socket.io.min.js before analytics-tracker.js');
            }
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Track initial page view
            if (this.config.trackPageViews) {
                this.trackPageView();
            }
            
            this.isInitialized = true;
            this.log('Analytics tracker initialized');
            
            // Process any queued events
            this.processEventQueue();
            
        } catch (error) {
            console.error('Error initializing analytics tracker:', error);
        }
    }

    async initializeSession() {
        // Check if session ID exists in localStorage
        this.sessionId = localStorage.getItem('analytics_session_id');
        
        if (!this.sessionId) {
            try {
                const response = await fetch(`${this.config.apiUrl}/session`);
                const data = await response.json();
                
                if (data.success) {
                    this.sessionId = data.sessionId;
                    localStorage.setItem('analytics_session_id', this.sessionId);
                    localStorage.setItem('analytics_session_start', Date.now().toString());
                }
            } catch (error) {
                this.log('Error getting session ID:', error);
                // Fallback to generating client-side session ID
                this.sessionId = this.generateSessionId();
                localStorage.setItem('analytics_session_id', this.sessionId);
                localStorage.setItem('analytics_session_start', Date.now().toString());
            }
        }

        // Check if session has expired
        const sessionStart = localStorage.getItem('analytics_session_start');
        if (sessionStart) {
            const sessionAge = (Date.now() - parseInt(sessionStart)) / (1000 * 60); // minutes
            if (sessionAge > this.config.sessionTimeout) {
                // Session expired, create new one
                await this.initializeSession();
            }
        }
    }

    initializeWebSocket() {
        try {
            console.log('Connecting to WebSocket server at:', this.config.websocketUrl);
            this.socket = io(this.config.websocketUrl);
            
            this.socket.on('connect', () => {
                console.log('WebSocket connected successfully. Socket ID:', this.socket.id);
                
                // Send user activity
                const activityData = {
                    sessionId: this.sessionId,
                    page: window.location.pathname,
                    userId: this.userId
                };
                console.log('Sending initial user activity:', activityData);
                this.socket.emit('user-activity', activityData);
            });

            this.socket.on('connect_error', (error) => {
                console.error('WebSocket connection error:', error);
            });

            this.socket.on('disconnect', (reason) => {
                console.log('WebSocket disconnected. Reason:', reason);
            });

            // Set up periodic activity updates
            setInterval(() => {
                if (this.socket && this.socket.connected) {
                    const activityData = {
                        sessionId: this.sessionId,
                        page: window.location.pathname,
                        userId: this.userId
                    };
                    console.log('Sending periodic user activity:', activityData);
                    this.socket.emit('user-activity', activityData);
                } else {
                    console.warn('Cannot send activity update - socket disconnected');
                }
            }, 30000); // Every 30 seconds
            
        } catch (error) {
            console.error('Error initializing WebSocket:', error);
        }
    }

    setupEventListeners() {
        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEvent('page_hidden', 'Page Hidden', window.location.pathname);
            } else {
                this.trackEvent('page_visible', 'Page Visible', window.location.pathname);
            }
        });

        // Track page unload
        window.addEventListener('beforeunload', () => {
            this.endSession();
        });

        // Track clicks
        if (this.config.trackClicks) {
            document.addEventListener('click', (event) => {
                this.handleClick(event);
            });
        }

        // Track form submissions
        if (this.config.trackFormSubmissions) {
            document.addEventListener('submit', (event) => {
                this.handleFormSubmission(event);
            });
        }

        // Track scrolling
        if (this.config.trackScrolling) {
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    this.handleScroll();
                }, 100);
            });
        }

        // Track hash changes (for SPAs)
        window.addEventListener('hashchange', () => {
            if (this.config.trackPageViews) {
                this.trackPageView();
            }
        });

        // Track history changes (for SPAs)
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            originalPushState.apply(history, arguments);
            setTimeout(() => {
                if (this.config.trackPageViews) {
                    this.trackPageView();
                }
            }, 0);
        }.bind(this);

        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            setTimeout(() => {
                if (this.config.trackPageViews) {
                    this.trackPageView();
                }
            }, 0);
        }.bind(this);
    }

    async trackPageView(customData = {}) {
        const pageData = {
            sessionId: this.sessionId,
            userId: this.userId,
            page: window.location.pathname,
            title: document.title,
            referrer: document.referrer,
            screenResolution: {
                width: window.screen.width,
                height: window.screen.height
            },
            timestamp: new Date().toISOString(),
            ...customData
        };

        try {
            const response = await fetch(`${this.config.apiUrl}/track/pageview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pageData)
            });

            const result = await response.json();
            
            if (result.success) {
                this.log('Page view tracked:', pageData.page);
                
                // Emit via WebSocket for real-time updates
                if (this.socket && this.socket.connected) {
                    this.socket.emit('page-view', pageData);
                }
            }
        } catch (error) {
            this.log('Error tracking page view:', error);
            this.queueEvent('pageview', pageData);
        }

        // Reset page start time
        this.pageStartTime = Date.now();
        this.maxScrollDepth = 0;
    }

    async trackEvent(eventType, eventName, page = null, element = null, value = null, coordinates = null) {
        const eventData = {
            sessionId: this.sessionId,
            userId: this.userId,
            eventType,
            eventName,
            page: page || window.location.pathname,
            element,
            value,
            coordinates,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch(`${this.config.apiUrl}/track/event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData)
            });

            const result = await response.json();
            
            if (result.success) {
                this.log('Event tracked:', eventName);
                
                // Emit via WebSocket for real-time updates
                if (this.socket && this.socket.connected) {
                    this.socket.emit('custom-event', eventData);
                }
            }
        } catch (error) {
            this.log('Error tracking event:', error);
            this.queueEvent('event', eventData);
        }
    }

    handleClick(event) {
        const target = event.target;
        const tagName = target.tagName.toLowerCase();
        const className = target.className;
        const id = target.id;
        const text = target.textContent?.trim().substring(0, 100);
        
        let eventName = 'Click';
        let element = tagName;
        
        if (id) element += `#${id}`;
        if (className) element += `.${className.split(' ').join('.')}`;
        
        // Special handling for links
        if (tagName === 'a') {
            eventName = 'Link Click';
            element = target.href;
        }
        
        // Special handling for buttons
        if (tagName === 'button' || target.type === 'button') {
            eventName = 'Button Click';
        }

        this.trackEvent('click', eventName, null, element, text, {
            x: event.clientX,
            y: event.clientY
        });
    }

    handleFormSubmission(event) {
        const form = event.target;
        const formId = form.id;
        const formClass = form.className;
        const formAction = form.action;
        
        let element = 'form';
        if (formId) element += `#${formId}`;
        if (formClass) element += `.${formClass.split(' ').join('.')}`;
        
        this.trackEvent('form_submit', 'Form Submission', null, element, formAction);
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / documentHeight) * 100);
        
        this.scrollDepth = scrollPercent;
        
        // Track significant scroll milestones
        if (scrollPercent > this.maxScrollDepth) {
            this.maxScrollDepth = scrollPercent;
            
            if (scrollPercent >= 25 && scrollPercent < 50 && this.maxScrollDepth < 25) {
                this.trackEvent('scroll', 'Scroll 25%', null, null, 25);
            } else if (scrollPercent >= 50 && scrollPercent < 75 && this.maxScrollDepth < 50) {
                this.trackEvent('scroll', 'Scroll 50%', null, null, 50);
            } else if (scrollPercent >= 75 && scrollPercent < 100 && this.maxScrollDepth < 75) {
                this.trackEvent('scroll', 'Scroll 75%', null, null, 75);
            } else if (scrollPercent >= 100 && this.maxScrollDepth < 100) {
                this.trackEvent('scroll', 'Scroll 100%', null, null, 100);
            }
        }
    }

    async endSession() {
        const sessionDuration = Math.round((Date.now() - this.pageStartTime) / 1000);
        
        try {
            await fetch(`${this.config.apiUrl}/session/end`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: this.sessionId,
                    duration: sessionDuration
                })
            });
            
            this.log('Session ended');
        } catch (error) {
            this.log('Error ending session:', error);
        }
    }

    // Queue events when offline or API is unavailable
    queueEvent(type, data) {
        this.eventQueue.push({ type, data, timestamp: Date.now() });
        
        // Limit queue size
        if (this.eventQueue.length > 100) {
            this.eventQueue.shift();
        }
        
        // Store in localStorage for persistence
        localStorage.setItem('analytics_event_queue', JSON.stringify(this.eventQueue));
    }

    async processEventQueue() {
        // Load queued events from localStorage
        const storedQueue = localStorage.getItem('analytics_event_queue');
        if (storedQueue) {
            try {
                this.eventQueue = JSON.parse(storedQueue);
            } catch (error) {
                this.log('Error parsing event queue:', error);
            }
        }

        // Process queued events
        const queue = [...this.eventQueue];
        this.eventQueue = [];
        
        for (const { type, data } of queue) {
            try {
                if (type === 'pageview') {
                    await this.trackPageView(data);
                } else if (type === 'event') {
                    await this.trackEvent(data.eventType, data.eventName, data.page, data.element, data.value, data.coordinates);
                }
            } catch (error) {
                this.log('Error processing queued event:', error);
                // Re-queue if still failing
                this.queueEvent(type, data);
            }
        }
        
        // Update localStorage
        localStorage.setItem('analytics_event_queue', JSON.stringify(this.eventQueue));
    }

    // Set user ID (call this after user logs in)
    setUserId(userId) {
        this.userId = userId;
        localStorage.setItem('analytics_user_id', userId);
    }

    // Get user ID
    getUserId() {
        return this.userId || localStorage.getItem('analytics_user_id');
    }

    // Generate client-side session ID as fallback
    generateSessionId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Utility function for logging
    log(...args) {
        if (this.config.debug) {
            console.log('[Analytics]', ...args);
        }
    }

    // Public API methods
    track(eventName, properties = {}) {
        this.trackEvent('custom', eventName, null, null, properties);
    }

    identify(userId, properties = {}) {
        this.setUserId(userId);
        this.trackEvent('identify', 'User Identified', null, null, { userId, ...properties });
    }

    page(pageName = null, properties = {}) {
        this.trackPageView({ customPageName: pageName, ...properties });
    }
}

// Auto-initialize if config is provided
if (typeof window !== 'undefined') {
    window.AnalyticsTracker = AnalyticsTracker;
    
    // Auto-initialize with default config if analytics config is found
    if (window.analyticsConfig) {
        window.analytics = new AnalyticsTracker(window.analyticsConfig);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsTracker;
} 