import "@/styles/logo.css";



export const CustomLogo = () => {
  return (
    <div className="flex items-center justify-center py-4">
      <img
        src="/LogoApp-AgroHuracan-desktop.png"
        alt="AgroHuracan"
        className="h-20 w-auto logo-glow transition-transform duration-300 hover:scale-105"
      />
    </div>
  )
}
