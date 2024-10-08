"use client"; 
import Image from 'next/image';


export default function HomePage() {
  return (
    <div className="min-h-screen bg-black-100">
      {/* Navbar */}
      <nav className="bg-indigo-950 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <Image
              src="/img/logo.png"  // Path to your icon image
              alt="Genshin Icon"
              width={500}
              height={200}
              className="h-8 w-8"   // Set the size of the icon
            />
            <div className="text-2xl font-bold">Genshin Dex</div>
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
        <Image
          src="/img/header_img.jpg"
          alt="Genshin Impact"
          width={500}
          height={200}
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
        <div className="bg-indigo-200 shadow-md rounded-lg overflow-hidden">
          <Image
            src="/img/character.png"
            alt="Characters"
            width={500}
            height={200}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 text-center">
            <h2 className="text-violet-950 text-xl font-semibold">Characters</h2>
            <p className="text-indigo-900 mt-1">Explore all playable characters.</p>
            <button
              onClick={() => window.location.href = '/characters'}
              className="bg-violet-800 text-white py-2 px-4 rounded hover:bg-violet-900 mt-4"
            >
              View Characters
            </button>
          </div>
        </div>

      <div className="bg-indigo-200 shadow-md rounded-lg overflow-hidden">
          <Image
          src="/img/weapon.png"
          alt="Weapons"
          width={500}
          height={200}
          className="w-full h-48 object-cover"
          />
          <div className="p-4 text-center">
          <h2 className="text-violet-950 text-xl font-semibold">Weapons</h2>
          <p className="text-indigo-900 mt-1">Discover all available weapons.</p>
          <button
          onClick={() => window.location.href = '/weapons'}
          className="bg-violet-800 text-white py-2 px-4 rounded hover:bg-violet-900 mt-4"
          >
          View Weapons
          </button>
        </div>
      </div>

        {/* Monster Card */}
        <div className="bg-indigo-200 shadow-md rounded-lg overflow-hidden">
          <Image
            src="/img/monster.jpg"
            alt="Monsters"
            width={500}
            height={200}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 text-center">
            <h2 className="text-violet-950 text-xl font-semibold">Monsters</h2>
            <p className="text-indigo-900 mt-1">Learn about the monsters of Teyvat.</p>
            <button
              onClick={() => window.location.href = '/monsters'}
              className="bg-violet-800 text-white py-2 px-4 rounded hover:bg-violet-900 mt-4"
            >
            View Monsters
            </button>
          </div>
        </div>
      {/* About Genshin Impact */}
<div className="bg-indigo-200 shadow-md rounded-lg overflow-x-auto flex flex-col md:col-span-3">
  <div className="flex flex-row">
    <Image
      src="/img/genshin_about.png"
      alt="About Genshin Impact"
      width={500}
      height={200}
      className="w-50 h-48 object-cover"
        />
          <div className="ml-4 mt-4">
            <h2 className="text-violet-950 text-2xl font-semibold">About Genshin Impact</h2>
            <p className="text-indigo-900 line-height-1.5 mt-2">Genshin Impact is an open-world action role-playing game developed by miHoYo. Set in the visually stunning fantasy world of Teyvat, players explore seven distinct regions, each based on real-world cultures and powered by unique elemental forces. The story revolves around the protagonist, known as the Traveler, who is on a quest to reunite with their lost sibling and unravel the mysteries of Teyvat and its elemental gods, known as Archons.</p>
        
            <a
              href="https://genshin.hoyoverse.com/en/home"
              className="text-violet-500 hover:underline block mt-2 "
          
            >
              Explore the game
              <span className="ml-1">{">>"}</span>
            </a>
          </div>
        </div>
      </div>
  <div className="bg-indigo-200 shadow-md rounded-lg overflow-x-auto flex flex-col md:col-span-3">
  <div className="flex flex-row">
          <div className="ml-4 mt-4">
            <h2 className="text-violet-950 text-2xl font-semibold">New Character</h2>
            <p className="text-indigo-900 line-height-1.5 mt-2">A Saurian Hunter from the Scions of the Canopy with the Ancient Name &quot;Malipo&quot;, Kinich is a taciturn individual who has a knack for calculating the price of any request — even wetwork — due to his utilitarian philosophy. He is almost always seen with the egocentric self-proclaimed &quot;Almighty Dragonlord&quot; K&apos;uhul Ajaw, whom he regularly quarrels with.</p>
        
            <a
              href="https://www.youtube.com/watch?v=dz0w5JRG3jY&t=1s"
              className="text-violet-500 hover:underline block mt-2 "
          
            >
              Watch the Trailer
              <span className="ml-1">{">>"}</span>
            </a>
            
          </div>
          <Image
            width={500}
            height={200}
            src="/img/Kinich.jpg"
            alt="About Genshin Impact"
            className="w-50 h-48 object-cover"
          />
        </div>
      </div>
    </section>
    <section className="container mx-auto py-8 justify-center text-center">
  <h3 className="text-white text-xl font-bold">About Us</h3>
  <div className="contact-info-upper-container flex items-center justify-center mt-4">
    <div className="contact-info-container flex items-center">
      <Image
        src="/img/github-mark-white.png"
        alt="github"
        width={500}
        height={200}
        className="w-10 h-10 object-cover cursor-pointer hover:underline" // Added margin and cursor
      />
      <div className="text-white cursor-pointer hover:underline ml-2" onClick={() => {
          window.location.href = 'https://github.com/AustinXu-Dev/GenshinDex'; // Make text clickable as well
        }}>
        Github
      </div>
    </div>
    </div>
    </section>
        {/* Footer Section */}
      <footer className="bg-indigo-950 text-white text-center py-4 mt-8">
        <p className="text-sm">&copy; {new Date().getFullYear()} All rights reserved.</p>
      </footer>

    </div>
    
  );
}

