import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 text-center bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2 text-gray-400">
            <span className="text-lg">❤️</span>
            <span className="text-sm">Made with love</span>
            <span className="text-lg">❤️</span>
          </div>
          <p className="text-sm text-gray-600">
            Source code available on{' '}
            <a
              href="https://github.com/thebcs-family/wedding_invitation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-500 hover:text-rose-600 transition-colors duration-200"
            >
              GitHub
            </a>
          </p>
          <div className="text-xs text-gray-400 mt-2">
            © {new Date().getFullYear()} Federico & Cecilia
            <p className="text-xs text-gray-400">
            Images Designed by Freepik
          </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 