import Navbar from "../components/NavigationBar";

export default function BaseLayout({ children }) {
  return (
    <div className="container mx-auto">
      <Navbar />
      {children}
    </div>
  );
}
