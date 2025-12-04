import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm here to help with your interior design questions. How can I assist you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');

  const responses = {
    'services': [
      'We offer complete interior design, modular kitchens, custom furniture, and home decor solutions.',
      'Our services include residential design, commercial spaces, kitchen remodeling, and furniture design.',
      'We specialize in modern interiors, traditional designs, space planning, and turnkey solutions.'
    ],
    'price': [
      'Our pricing varies based on project scope. Contact us for a personalized quote!',
      'We offer competitive rates starting from ₹50,000. Get a free consultation to discuss your budget.',
      'Pricing depends on area size and requirements. We provide transparent quotes with no hidden costs.'
    ],
    'contact': [
      'You can reach us via WhatsApp or our contact form. We respond within 24 hours.',
      'Call us at +91-9082357585 or email designermonk@gmail.com for immediate assistance.',
      'Visit our office or schedule a home visit. We\'re available 7 days a week for consultations.'
    ],
    'portfolio': [
      'Check out our Portfolio page to see 500+ completed projects across different styles.',
      'Browse our gallery featuring luxury homes, apartments, and commercial spaces we\'ve designed.',
      'View our recent work including modern kitchens, elegant bedrooms, and stylish living rooms.'
    ],
    'time': [
      'Project timelines typically range from 4-12 weeks depending on complexity and scope.',
      'Small projects take 2-4 weeks, while complete home makeovers need 8-12 weeks.',
      'We provide detailed timelines during consultation and keep you updated throughout the process.'
    ],
    'default': [
      'Thanks for your question! Please contact us at 9082357585 or designermonk@gmail.com for detailed information.',
      'I\'d be happy to help! For specific queries, reach us at 9082357585 or designermonk@gmail.com.',
      'Great question! Contact our design experts at 9082357585 or designermonk@gmail.com for detailed answers.'
    ]
  };

  const getResponse = (message: string): string => {
    const lower = message.toLowerCase();
    let responseArray;
    
    if (lower.includes('service') || lower.includes('what do you do')) responseArray = responses.services;
    else if (lower.includes('price') || lower.includes('cost') || lower.includes('budget')) responseArray = responses.price;
    else if (lower.includes('contact') || lower.includes('reach') || lower.includes('phone')) responseArray = responses.contact;
    else if (lower.includes('portfolio') || lower.includes('work') || lower.includes('project')) responseArray = responses.portfolio;
    else if (lower.includes('time') || lower.includes('duration') || lower.includes('how long')) responseArray = responses.time;
    else responseArray = responses.default;
    
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, isUser: true };
    const botResponse = { text: getResponse(input), isUser: false };
    
    setMessages(prev => [...prev, userMessage, botResponse]);
    setInput('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white border rounded-lg shadow-xl z-50 flex flex-col">
          <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Chat with us</h3>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-lg text-sm ${
                  msg.isUser 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSend}
              className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;