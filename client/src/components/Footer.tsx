export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <a href="#hero" className="text-2xl font-bold font-poppins text-primary">
              <span className="text-white">&lt;</span>Dev<span className="text-white">/&gt;</span>
            </a>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Edwan Marques. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
