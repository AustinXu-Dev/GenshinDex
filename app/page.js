

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black-100">
      {/* Navbar */}
      <nav className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between">
          <div className="text-2xl font-bold">Genshin Impact Database</div>
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
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <h1 className="text-gray text-4xl font-bold">
            Welcome to Genshin Impact Database
          </h1>
        </div>
      </header>

      {/* Game Description */}
      <section className="container mx-auto py-8 text-center">
        <p className="text-gray-700 text-lg">
          Explore and manage information about characters, weapons, and monsters
          in Genshin Impact. This database provides comprehensive details to
          help you dive deeper into the world of Teyvat.
        </p>
      </section>

      {/* Data Entities Cards */}
      <section className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
        {/* Character Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <img
            src="/img/character.jpg"
            alt="Characters"
            className="w-full h-48 object-cover"
          />
          <div className="p-4 text-center">
            <h2 className="text-black text-xl font-semibold">Characters</h2>
            <p className="text-gray-600">Explore all playable characters.</p>
            <a
              href="/characters"
              className="text-blue-600 hover:underline block mt-4"
            >
              View Characters
            </a>
          </div>
        </div>

        {/* Weapon Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <img
            src="/img/weapon.jpg"
            alt="Weapons"
            className="w-full h-48 object-cover"
          />
          <div className="p-4 text-center">
            <h2 className="text-black text-xl font-semibold">Weapons</h2>
            <p className="text-gray-600">Discover all available weapons.</p>
            <a
              href="/weapons"
              className="text-blue-600 hover:underline block mt-4"
            >
              View Weapons
            </a>
          </div>
        </div>

        {/* Monster Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <img
            src="/img/monster.png"
            alt="Monsters"
            className="w-full h-48 object-cover"
          />
          <div className="p-4 text-center">
            <h2 className="text-black text-xl font-semibold">Monsters</h2>
            <p className="text-gray-600">Learn about the monsters of Teyvat.</p>
            <a
              href="/monsters"
              className="text-blue-600 hover:underline block mt-4"
            >
              View Monsters
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}