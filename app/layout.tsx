import "./globle.css";

export const metadata = {
  title: "Shopmate | Customer Care",
  description: "Helpful answers for your orders, products, delivery, and returns.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
