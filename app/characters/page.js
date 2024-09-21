"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Link from 'next/link'; // Use Link for navigation

export default function CharacterPage() {
  const API_BASE = "/api";
  const { register, handleSubmit, reset } = useForm();
  const dropdownRef = useRef(null); // To handle click outside of dropdowns

  const [characters, setCharacters] = useState([]);
  const [originalCharacters, setOriginalCharacters] = useState([]); // To keep original character list for reset
  const [editMode, setEditMode] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(''); // 'add' or 'edit' or 'view'

  const [uniqueElements, setUniqueElements] = useState([]);
  const [uniqueWeapons, setUniqueWeapons] = useState([]);
  const [uniqueRegions, setUniqueRegions] = useState([]);

  const [selectedSort, setSelectedSort] = useState(""); // Track selected sort option
  const [selectedFilters, setSelectedFilters] = useState({
    element: null,
    weapon: null,
    region: null,
  }); // Track selected filters

  // Dropdown visibility state
  const [dropdownVisible, setDropdownVisible] = useState({
    sort: false,
    filterElement: false,
    filterWeapon: false,
    filterRegion: false,
  });

  useEffect(() => {
    fetchCharacters();
  }, []);

  useEffect(() => {
    // Close dropdowns when clicking outside of them
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible({
          sort: false,
          filterElement: false,
          filterWeapon: false,
          filterRegion: false,
        });
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function fetchCharacters() {
    try {
      const data = await fetch(`${API_BASE}/characters`);
      const characters = await data.json();
      setCharacters(characters);
      setOriginalCharacters(characters); // Save the original list for reset

      // Generate unique filter options
      setUniqueElements([...new Set(characters.map(c => c.element))]);
      setUniqueWeapons([...new Set(characters.map(c => c.weapon))]);
      setUniqueRegions([...new Set(characters.map(c => c.region))]);
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  }

  // Handle sorting by name (string) or rarity (integer)
  function handleSortBy(attribute) {
    setSelectedSort(attribute); // Set the selected sort option

    const sortedCharacters = [...characters].sort((a, b) => {
      if (attribute === "name") {
        return a[attribute].localeCompare(b[attribute]);
      } else if (attribute === "rarity") {
        return a[attribute] - b[attribute];
      }
    });
    setCharacters(sortedCharacters);
  }

  // Undo sort
  function undoSort() {
    setSelectedSort(""); // Reset selected sort
    applyFilters(); // Reapply current filters
  }

  // Handle filtering by criteria (element, weapon, region)
  function handleFilterBy(criteria, value) {
    const newFilters = { ...selectedFilters };

    // Toggle filter: if the same filter is clicked again, reset it
    if (selectedFilters[criteria] === value) {
      newFilters[criteria] = null;
    } else {
      newFilters[criteria] = value;
    }

    setSelectedFilters(newFilters);
    applyFilters(newFilters); // Apply updated filters
  }

  // Apply all selected filters to the character list
  function applyFilters(filters = selectedFilters) {
    let filteredCharacters = [...originalCharacters];

    // Apply element filter
    if (filters.element) {
      filteredCharacters = filteredCharacters.filter(character => character.element === filters.element);
    }

    // Apply weapon filter
    if (filters.weapon) {
      filteredCharacters = filteredCharacters.filter(character => character.weapon === filters.weapon);
    }

    // Apply region filter
    if (filters.region) {
      filteredCharacters = filteredCharacters.filter(character => character.region === filters.region);
    }

    setCharacters(filteredCharacters);
  }

  // Undo all filters (reset everything)
  function undoFilter() {
    setSelectedFilters({ element: null, weapon: null, region: null }); // Reset all selected filters
    setCharacters(originalCharacters); // Reset character list to original state
  }

  // Start edit mode with selected character data
  function startEditMode(character) {
    reset(character);
    setSelectedCharacter(character);
    setPopupType('edit');
    setShowPopup(true);
  }

  // Stop edit mode and reset form
  function stopEditMode() {
    reset({
      name: "",
      element: "",
      weapon: "",
      region: "",
      rarity: "",
      description: "",
      image: "",
    });
    setEditMode(false);
    setSelectedCharacter(null);
    setShowPopup(false);
  }

  // Submit the form for adding or editing a character
  function handleCharacterFormSubmit(data) {
    const method = popupType === 'edit' ? "PUT" : "POST";
    const url = popupType === 'edit' ? `${API_BASE}/characters/${selectedCharacter.id}` : `${API_BASE}/characters`;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      fetchCharacters();
      stopEditMode();
    });
  }

  // Delete a character
async function deleteCharacter(character) {
  if (!confirm(`Are you sure to delete [${character.name}]`)) return;

  try {
    const id = character.id;
    const res = await fetch(`${API_BASE}/characters/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchCharacters(); // Refresh the characters list after deletion
    } else {
      const errorData = await res.json();
      console.error('Delete failed:', errorData.message || 'Unknown error');
    }
  } catch (error) {
    console.error('Error deleting character:', error);
  }
}

  // View character info
  function viewCharacterInfo(character) {
    setSelectedCharacter(character);
    setPopupType('view');
    setShowPopup(true);
  }

  // Close pop-up
  function closePopup() {
    setShowPopup(false);
    setSelectedCharacter(null);
  }

  // Toggle dropdown visibility
  const toggleDropdown = (type) => {
    setDropdownVisible({
      ...dropdownVisible,
      [type]: !dropdownVisible[type],
    });
  };

  return (
    <div className="container mx-auto py-8" ref={dropdownRef}>
      {/* Back Button and Title */}
      <div className="flex justify-between items-center mb-8">
        <Link href="/">
        <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center gap-2 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <svg class="w-5 h-5 flip-horizontal" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
        Back
        <span class="sr-only">Icon description</span>
        </button>
        </Link>
        <h1 className="text-3xl font-bold">Characters</h1>
      </div>

      {/* Add New Button */}
      <button onClick={() => { setPopupType('add'); setShowPopup(true); }} className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
        Add New Character
      </button>

      {/* Dropdowns for Sorting and Filtering */}
      <div className="flex justify-between mb-4 mt-4">
        {/* Sort By Dropdown */}
        <div className="relative inline-block text-left">
          <button onClick={() => toggleDropdown("sort")} className={`px-2 py-2 rounded-md ${selectedSort ? 'bg-blue-950 text-white' : 'bg-blue-800 text-white'} hover:bg-blue-700`}>
            Sort By
          </button>
          {dropdownVisible.sort && (
            <div className="absolute left-2 mt-2 w-36 bg-white border rounded-md shadow-lg">
              <button className={`block px-4 py-2 ${selectedSort === "name" ? 'bg-gray-300' : 'text-gray-800 hover:bg-gray-200'}`} onClick={() => handleSortBy("name")}>
                Name
              </button>
              <button className={`block px-4 py-2 ${selectedSort === "rarity" ? 'bg-gray-300' : 'text-gray-800 hover:bg-gray-200'}`} onClick={() => handleSortBy("rarity")}>
                Rarity
              </button>
              <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={undoSort}>
                Undo Sort
              </button>
            </div>
          )}
        </div>

        {/* Filter By Element Dropdown */}
        <div className="relative inline-block text-left">
          <button onClick={() => toggleDropdown("filterElement")} className={`px-2 py-2 rounded-md ${selectedFilters.element ? 'bg-blue-950 text-white' : 'bg-blue-800 text-white'} hover:bg-blue-700`}>
            Filter by Element
          </button>
          {dropdownVisible.filterElement && (
            <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg">
              {uniqueElements.map((element) => (
                <button key={element} className={`block px-4 py-2 ${selectedFilters.element === element ? 'bg-gray-300' : 'text-gray-800 hover:bg-gray-200'}`} onClick={() => handleFilterBy("element", element)}>
                  {element}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter By Weapon Dropdown */}
        <div className="relative inline-block text-left">
          <button onClick={() => toggleDropdown("filterWeapon")} className={`px-2 py-2 rounded-md ${selectedFilters.weapon ? 'bg-blue-950 text-white' : 'bg-blue-800 text-white'} hover:bg-blue-700`}>
            Filter by Weapon
          </button>
          {dropdownVisible.filterWeapon && (
            <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg">
              {uniqueWeapons.map((weapon) => (
                <button key={weapon} className={`block px-4 py-2 ${selectedFilters.weapon === weapon ? 'bg-gray-300' : 'text-gray-800 hover:bg-gray-200'}`} onClick={() => handleFilterBy("weapon", weapon)}>
                  {weapon}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter By Region Dropdown */}
        <div className="relative inline-block text-left">
          <button onClick={() => toggleDropdown("filterRegion")} className={`px-2 py-2 rounded-md ${selectedFilters.region ? 'bg-blue-950 text-white' : 'bg-blue-800 text-white'} hover:bg-blue-700`}>
            Filter by Region
          </button>
          {dropdownVisible.filterRegion && (
            <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg">
              {uniqueRegions.map((region) => (
                <button key={region} className={`block px-4 py-2 ${selectedFilters.region === region ? 'bg-gray-300' : 'text-gray-800 hover:bg-gray-200'}`} onClick={() => handleFilterBy("region", region)}>
                  {region}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Undo Filter Button */}
        <button onClick={undoFilter} className="bg-red-800 text-white px-4 py-2 rounded-md hover:bg-red-900">
          Undo Filter
        </button>
      </div>

      {/* Character Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {characters.map((character) => (
          <div key={character.id} className="bg-indigo-100 shadow-lg rounded-lg overflow-hidden">
            <div className="flex justify-end space-x-2 p-2">
              <button onClick={() => deleteCharacter(character)} className="bg-red-900 text-white px-2 py-1 rounded hover:bg-red-700">
                Delete
              </button>
              <button onClick={() => startEditMode(character)} className="bg-amber-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                Edit
              </button>
            </div>
            <img src={character.image} alt={character.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-indigo-950 text-xl font-semibold">{character.name}</h2>
              <button onClick={() => viewCharacterInfo(character)} className="bg-indigo-900 text-white px-4 py-2 rounded-md mt-4 hover:bg-indigo-950">
                View Info
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup for Add/Edit/View */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <button onClick={closePopup} className="absolute top-2 right-2 bg-red-900 text-white px-4 py-2 rounded-md hover:bg-red-800">
              Close
            </button>
            {popupType === 'view' && selectedCharacter && (
              <>
                <img src={selectedCharacter.image} alt={selectedCharacter.name} className="w-32 h-32 object-cover mx-auto" />
                <h2 className="text-black text-2xl font-bold text-center">{selectedCharacter.name}</h2>
                <p className="text-gray-700 text-center mt-2">{selectedCharacter.description}</p>
                <div className="mt-4 space-y-2 text-center">
                  <p className="text-black "><strong>Element:</strong> {selectedCharacter.element}</p>
                  <p className="text-black "><strong>Weapon:</strong> {selectedCharacter.weapon}</p>
                  <p className="text-black "><strong>Region:</strong> {selectedCharacter.region}</p>
                  <p className="text-black "><strong>Rarity:</strong> {selectedCharacter.rarity}</p>
                </div>
              </>
            )}

            {(popupType === 'add' || popupType === 'edit') && (
              <form onSubmit={handleSubmit(handleCharacterFormSubmit)}>
                <h2 className="text-black text-2xl font-bold mb-4">{popupType === 'add' ? 'Add New Character' : 'Edit Character'}</h2>
                <div className="space-y-4">
                  <input name="name" defaultValue={selectedCharacter?.name || ''} placeholder="Name" {...register("name")} className="w-full p-2 border rounded-md text-gray-900" required />
                  <input name="element" defaultValue={selectedCharacter?.element || ''} placeholder="Element" {...register("element")} className="w-full p-2 border rounded-md text-gray-900" required />
                  <input name="weapon" defaultValue={selectedCharacter?.weapon || ''} placeholder="Weapon" {...register("weapon")} className="w-full p-2 border rounded-md text-gray-900" required />
                  <input name="region" defaultValue={selectedCharacter?.region || ''} placeholder="Region" {...register("region")} className="w-full p-2 border rounded-md text-gray-900" required />
                  <input name="rarity" type="number" defaultValue={selectedCharacter?.rarity || ''} placeholder="Rarity" {...register("rarity")} className="w-full p-2 border rounded-md text-gray-900" required />
                  <textarea name="description" defaultValue={selectedCharacter?.description || ''} placeholder="Description" {...register("description")} className="w-full p-2 border rounded-md text-gray-900" required />
                  <input name="image" defaultValue={selectedCharacter?.image || ''} placeholder="Image URL" {...register("image")} className="w-full p-2 border rounded-md text-gray-900" required />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-700">
                  {popupType === 'add' ? 'Add Character' : 'Save Changes'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}