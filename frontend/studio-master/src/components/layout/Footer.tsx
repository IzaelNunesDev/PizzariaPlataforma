export default function Footer() {
  return (
    <footer className="bg-card shadow-sm py-6 mt-auto">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SliceSite. All rights reserved.</p>
      </div>
    </footer>
  );
}
