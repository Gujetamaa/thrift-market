import "../../css/components/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} EcoFit</p>
    </footer>
  );
}
