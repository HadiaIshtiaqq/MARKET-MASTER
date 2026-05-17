import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User,
  Bell,
  Shield,
  Database,
  Zap,
  Palette,
  Globe,
  Key,
  Mail,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'advanced', label: 'Advanced', icon: Zap }
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
            Settings & Configuration
          </h1>
          <p className="text-on-surface-variant flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: '3s' }} />
            Customize your MarketMaster AI experience
          </p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-primary to-secondary text-on-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/30 sticky top-24">
            <nav className="space-y-2">
              {tabs.map((tab, i) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary border-l-4 border-primary'
                        : 'text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {activeTab === 'profile' && (
              <>
                <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30">
                  <h2 className="text-xl font-bold mb-6">Profile Information</h2>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary font-bold text-2xl">
                        AD
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">Admin Account</h3>
                        <p className="text-sm text-on-surface-variant mb-3">admin@marketmaster.ai</p>
                        <div className="flex gap-3">
                          <button className="px-4 py-2 bg-surface-container-high rounded-lg text-sm font-bold hover:bg-surface-container-highest transition-all">
                            Change Avatar
                          </button>
                          <button className="px-4 py-2 bg-surface-container-high rounded-lg text-sm font-bold hover:bg-surface-container-highest transition-all">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">Full Name</label>
                        <input 
                          type="text" 
                          defaultValue="Admin User"
                          className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Email</label>
                        <input 
                          type="email" 
                          defaultValue="admin@marketmaster.ai"
                          className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Company</label>
                        <input 
                          type="text" 
                          defaultValue="MarketMaster AI"
                          className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Role</label>
                        <select className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary/50 transition-all">
                          <option>Administrator</option>
                          <option>Manager</option>
                          <option>User</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30">
                  <h2 className="text-xl font-bold mb-6">Account Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl">
                      <div>
                        <p className="font-bold text-sm mb-1">Language</p>
                        <p className="text-xs text-on-surface-variant">Choose your preferred language</p>
                      </div>
                      <select className="px-4 py-2 bg-surface-container-highest border border-outline-variant/30 rounded-lg text-sm font-bold">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl">
                      <div>
                        <p className="font-bold text-sm mb-1">Timezone</p>
                        <p className="text-xs text-on-surface-variant">Set your local timezone</p>
                      </div>
                      <select className="px-4 py-2 bg-surface-container-highest border border-outline-variant/30 rounded-lg text-sm font-bold">
                        <option>UTC-5 (EST)</option>
                        <option>UTC+0 (GMT)</option>
                        <option>UTC+1 (CET)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30">
                <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { title: 'Email Notifications', description: 'Receive updates via email', enabled: true },
                    { title: 'Push Notifications', description: 'Browser push notifications', enabled: true },
                    { title: 'Agent Alerts', description: 'Notifications from AI agents', enabled: true },
                    { title: 'System Updates', description: 'Platform updates and maintenance', enabled: false },
                    { title: 'Marketing Emails', description: 'Product news and offers', enabled: false },
                    { title: 'Weekly Reports', description: 'Weekly performance summaries', enabled: true }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl hover:bg-surface-container-highest transition-all"
                    >
                      <div>
                        <p className="font-bold text-sm mb-1">{item.title}</p>
                        <p className="text-xs text-on-surface-variant">{item.description}</p>
                      </div>
                      <button 
                        className={`relative w-12 h-6 rounded-full transition-all ${
                          item.enabled ? 'bg-secondary' : 'bg-surface-container'
                        }`}
                      >
                        <span className={`absolute top-1 left-1 w-4 h-4 bg-on-secondary rounded-full transition-transform ${
                          item.enabled ? 'translate-x-6' : ''
                        }`} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <>
                <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30">
                  <h2 className="text-xl font-bold mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Current Password</label>
                      <input 
                        type="password" 
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">New Password</label>
                      <input 
                        type="password" 
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Confirm Password</label>
                      <input 
                        type="password" 
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-xl focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                    <button className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-primary/90 transition-all">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30">
                  <h2 className="text-xl font-bold mb-6">Two-Factor Authentication</h2>
                  <div className="flex items-start gap-4 p-4 bg-surface-container-high rounded-xl">
                    <Shield className="w-6 h-6 text-secondary mt-1" />
                    <div className="flex-1">
                      <p className="font-bold text-sm mb-2">Enable 2FA</p>
                      <p className="text-xs text-on-surface-variant mb-4">Add an extra layer of security to your account</p>
                      <button className="px-4 py-2 bg-secondary text-on-secondary rounded-lg font-bold text-sm hover:bg-secondary/90 transition-all">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'integrations' && (
              <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30">
                <h2 className="text-xl font-bold mb-6">API & Integrations</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">API Key</label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input 
                          type={showApiKey ? 'text' : 'password'}
                          value="sk_live_1234567890abcdef"
                          readOnly
                          className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-xl font-mono text-sm"
                        />
                        <button 
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-surface-container rounded-lg transition-colors"
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <button className="px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-xl font-bold text-sm hover:bg-surface-container-highest transition-all">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'Slack', status: 'connected', icon: '💬' },
                      { name: 'Google Analytics', status: 'connected', icon: '📊' },
                      { name: 'Stripe', status: 'disconnected', icon: '💳' },
                      { name: 'Shopify', status: 'connected', icon: '🛍️' }
                    ].map((integration, i) => (
                      <div key={i} className="p-4 bg-surface-container-high rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{integration.icon}</span>
                            <div>
                              <p className="font-bold text-sm">{integration.name}</p>
                              <p className={`text-xs ${integration.status === 'connected' ? 'text-secondary' : 'text-on-surface-variant'}`}>
                                {integration.status}
                              </p>
                            </div>
                          </div>
                          <button className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            integration.status === 'connected' 
                              ? 'bg-error/10 text-error hover:bg-error/20' 
                              : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
                          } transition-all`}>
                            {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30">
                <h2 className="text-xl font-bold mb-6">Appearance Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-4">Theme</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['Dark', 'Light', 'Auto'].map((theme) => (
                        <button 
                          key={theme}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            theme === 'Dark' 
                              ? 'border-primary bg-primary/10' 
                              : 'border-outline-variant/30 hover:border-primary/50'
                          }`}
                        >
                          <p className="font-bold text-sm">{theme}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-4">Accent Color</label>
                    <div className="flex gap-3">
                      {['#c0c1ff', '#4edea3', '#ffb95f', '#ff6b9d', '#a78bfa'].map((color) => (
                        <button 
                          key={color}
                          className="w-12 h-12 rounded-xl border-2 border-outline-variant/30 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <>
                <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30">
                  <h2 className="text-xl font-bold mb-6">Data Management</h2>
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-surface-container-high rounded-xl hover:bg-surface-container-highest transition-all group">
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-primary" />
                        <div className="text-left">
                          <p className="font-bold text-sm">Export Data</p>
                          <p className="text-xs text-on-surface-variant">Download all your data</p>
                        </div>
                      </div>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-surface-container-high rounded-xl hover:bg-surface-container-highest transition-all group">
                      <div className="flex items-center gap-3">
                        <Upload className="w-5 h-5 text-secondary" />
                        <div className="text-left">
                          <p className="font-bold text-sm">Import Data</p>
                          <p className="text-xs text-on-surface-variant">Upload data from file</p>
                        </div>
                      </div>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-error/10 rounded-xl hover:bg-error/20 transition-all group">
                      <div className="flex items-center gap-3">
                        <Trash2 className="w-5 h-5 text-error" />
                        <div className="text-left">
                          <p className="font-bold text-sm text-error">Delete Account</p>
                          <p className="text-xs text-on-surface-variant">Permanently delete your account</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30">
                  <h2 className="text-xl font-bold mb-6">System Information</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-surface-container-high rounded-lg">
                      <span className="text-sm text-on-surface-variant">Version</span>
                      <span className="text-sm font-bold font-mono">v2.4.0</span>
                    </div>
                    <div className="flex justify-between p-3 bg-surface-container-high rounded-lg">
                      <span className="text-sm text-on-surface-variant">Last Updated</span>
                      <span className="text-sm font-bold">May 17, 2026</span>
                    </div>
                    <div className="flex justify-between p-3 bg-surface-container-high rounded-lg">
                      <span className="text-sm text-on-surface-variant">License</span>
                      <span className="text-sm font-bold text-secondary">Pro Tier</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
