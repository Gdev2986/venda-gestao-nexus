
const Footer = () => {
  return (
    <footer className="bg-sigma-indigo-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-sigma-indigo-400 to-sigma-blue-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">Σ</span>
              </div>
              <span className="text-2xl font-bold">Sigma Pay</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Transformando a gestão financeira de empresas com soluções 
              inovadoras, seguras e eficientes.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="bg-sigma-indigo-800 hover:bg-sigma-indigo-700 p-3 rounded-lg transition-colors">
                📘
              </a>
              <a href="#" className="bg-sigma-indigo-800 hover:bg-sigma-indigo-700 p-3 rounded-lg transition-colors">
                📸
              </a>
              <a href="#" className="bg-sigma-indigo-800 hover:bg-sigma-indigo-700 p-3 rounded-lg transition-colors">
                🐦
              </a>
              <a href="#" className="bg-sigma-indigo-800 hover:bg-sigma-indigo-700 p-3 rounded-lg transition-colors">
                💼
              </a>
            </div>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
            <ul className="space-y-3">
              <li>
                <a href="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Central de Ajuda
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <span>📱</span>
                <a href="https://wa.me/5511999999999" className="text-gray-300 hover:text-white transition-colors">
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span>📧</span>
                <a href="mailto:contato@sigmapay.com.br" className="text-gray-300 hover:text-white transition-colors">
                  contato@sigmapay.com.br
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span>📍</span>
                <span className="text-gray-300">São Paulo, SP</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🕒</span>
                <span className="text-gray-300">Seg-Sex: 8h às 18h</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sigma-indigo-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Sigma Pay. Todos os direitos reservados.
          </p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            CNPJ: 00.000.000/0001-00 | Feito com ❤️ no Brasil
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
