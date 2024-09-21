export default function HomePage() {
  return (
    <div className="min-h-screen bg-black-100">
      {/* Navbar */}
      <nav className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <img
              src="/img/logo.png"  // Path to your icon image
              alt="Genshin Icon"
              className="h-8 w-8"   // Set the size of the icon
            />
            <div className="text-2xl font-bold">Genshin Impact Database</div>
          </div>

          {/* Navigation Links */}
          <ul className="flex space-x-4">
            <li>
              <a href="/characters" className="hover:underline">
                Characters
              </a>
            </li>
            <li>
              <a href="/weapons" className="hover:underline">
                Weapons
              </a>
            </li>
            <li>
              <a href="/monsters" className="hover:underline">
                Monsters
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Header */}
      <header className="relative">
        <img
          src="/img/header_Img.webp"
          alt="Genshin Impact"
          className="w-full h-60 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <h1 className="text-gray text-4xl font-bold">
            Welcome to Genshin Dex
          </h1>
        </div>
      </header>

      {/* Game Description */}
      <section className="container mx-auto py-8 text-center">
        <p className="text-white-700 text-lg">
        Welcome to the Genshin Dex, your comprehensive source for detailed 
        information on characters, weapons, and monsters in the expansive world of Teyvat. 
        Dive into the lore, stats, and abilities of your favorite heroes, find the best gear 
        for your adventures, and learn more about the fearsome foes that await.
        </p>
      </section>

      {/* Data Entities Cards */}
      <section className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
        {/* Character Card */}
        <div className="bg-indigo-50 shadow-md rounded-lg overflow-hidden">
          <img
            src="/img/character.png"
            alt="Characters"
            className="w-full h-48 object-cover"
          />
          <div className="p-4 text-center">
            <h2 className="text-violet-950 text-xl font-semibold">Characters</h2>
            <p className="text-gray-600">Explore all playable characters.</p>
            <a
              href="/characters"
              className="text-violet-500 hover:underline block mt-4"
            >
              View Characters
            </a>
          </div>
        </div>

        {/* Weapon Card */}
        <div className="bg-indigo-50 shadow-md rounded-lg overflow-hidden">
          <img
            src="/img/weapon.png"
            alt="Weapons"
            className="w-full h-48 object-cover"
          />
          <div className="p-4 text-center">
            <h2 className="text-violet-950 text-xl font-semibold">Weapons</h2>
            <p className="text-gray-600">Discover all available weapons.</p>
            <a
              href="/weapons"
              className="text-violet-500 hover:underline block mt-4"
            >
              View Weapons
            </a>
          </div>
        </div>

        {/* Monster Card */}
        <div className="bg-indigo-50 shadow-md rounded-lg overflow-hidden">
          <img
            src="/img/monster.jpg"
            alt="Monsters"
            className="w-full h-48 object-cover"
          />
          <div className="p-4 text-center">
            <h2 className="text-violet-950 text-xl font-semibold">Monsters</h2>
            <p className="text-gray-600">Learn about the monsters of Teyvat.</p>
            <a
              href="/monsters"
              className="text-violet-500 hover:underline block mt-4"
            >
              View Monsters
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}