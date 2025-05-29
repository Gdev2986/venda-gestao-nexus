
const ModernFooter = () => {
  return (
    <footer className="bg-black border-t border-gray-800 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo and Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">Σ</span>
              </div>
              <span className="text-3xl font-bold text-white">Sigma Pay</span>
            </div>
            <p className="text-gray-400 text-lg max-w-md">
              Transformando a gestão financeira com tecnologia de ponta e segurança máxima.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-6">Links Rápidos</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-lg">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-lg">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-lg">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-semibold text-white mb-6">Contato</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-end space-x-3">
                <span className="text-2xl">📱</span>
                <a href="https://wa.me/5511999999999" className="text-gray-400 hover:text-green-400 transition-colors duration-300 text-lg">
                  WhatsApp
                </a>
              </div>
              <div className="flex items-center justify-center md:justify-end space-x-3">
                <span className="text-2xl">📧</span>
                <a href="mailto:contato@sigmapay.com.br" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-lg">
                  contato@sigmapay.com.br
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-lg">
            © 2024 Sigma Pay • Tecnologia que transforma • Feito com ❤️ no Brasil
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
