import '../css/footer.css';

const Footer = () => {
  return (
  <footer className="footer">
    <div className="footer-content">
      <p>
        Pablo Velázquez - 
        <a 
          href="https://github.com/pabloisaiasvz" 
          target="_blank" 
          rel="noopener noreferrer"
          className="github-link"
        >
          GitHub
        </a>
      </p>
    </div>
  </footer>
  );
};

export default Footer;
