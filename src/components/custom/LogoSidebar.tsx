export const CustomLogoSidebar = () => {
  return (
    <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 w-full py-2`}>
      <img
        src="/LogoApp-AgroHuracan-desktop.png"
        alt="AgroHuracan"
        className="h-16 w-auto object-contain" // aumentamos la altura a 4rem
      />
    </div>
  )
}