import { useState, useEffect } from 'react';
import { portfolioService } from '../../services/portfolioService';

export default function ChatbotEditor() {
  const [context, setContext] = useState('');
  const [originalContext, setOriginalContext] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadContext();
  }, []);

  useEffect(() => {
    setHasChanges(context !== originalContext);
  }, [context, originalContext]);

  const loadContext = async () => {
    setLoading(true);
    try {
      const loadedContext = await portfolioService.getChatbotContext();
      setContext(loadedContext);
      setOriginalContext(loadedContext);
    } catch (error) {
      console.error('Error loading chatbot context:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await portfolioService.updateChatbotContext(context);
      setOriginalContext(context);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving chatbot context:', error);
      alert('Error saving chatbot context. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setContext(originalContext);
    setHasChanges(false);
  };

  const handleRestoreDefault = async () => {
    if (
      !confirm(
        'Are you sure you want to restore the default chatbot context? This will replace your current customizations.'
      )
    )
      return;

    setSaving(true);
    try {
      // Force reload to get the actual default
      await portfolioService.updateChatbotContext('');
      const freshDefault = await portfolioService.getChatbotContext();

      setContext(freshDefault);
      await portfolioService.updateChatbotContext(freshDefault);
      setOriginalContext(freshDefault);
      setHasChanges(false);
    } catch (error) {
      console.error('Error restoring default context:', error);
      alert('Error restoring default context. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600">
          Loading chatbot configuration...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            AI Chatbot Configuration
          </h2>
          <p className="text-sm text-gray-600">
            Customize the context and instructions that the AI chatbot uses to
            respond to visitors.
          </p>
        </div>
        <div className="flex space-x-2">
          {hasChanges && (
            <button
              onClick={handleReset}
              disabled={saving}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
            >
              Reset
            </button>
          )}
          <button
            onClick={handleRestoreDefault}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Restore Default
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chatbot Context & Instructions
          </label>
          <textarea
            value={context}
            onChange={e => setContext(e.target.value)}
            rows={20}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
            placeholder="Enter the context and instructions for the AI chatbot..."
          />
          <div className="flex justify-between mt-2">
            <p className="text-xs text-gray-500">
              This information will be used to train the AI on how to respond to
              visitors&rsquo; questions about you.
            </p>
            <span className="text-xs text-gray-400">
              {context.length} characters
            </span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            💡 Tips for editing the chatbot context:
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Include key personal and professional information</li>
            <li>• List your main skills, technologies, and experience</li>
            <li>• Describe your notable projects with brief summaries</li>
            <li>• Add contact information and social links</li>
            <li>
              • Use clear, factual language - the AI will use this directly
            </li>
            <li>• Test changes by asking the chatbot questions after saving</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
