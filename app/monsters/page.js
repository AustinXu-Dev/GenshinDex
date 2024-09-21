"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Link from 'next/link';
import Image from 'next/image';

export default function MonsterPage() {
  const API_BASE = "/api";
  const { register, handleSubmit, reset } = useForm();
  const dropdownRef = useRef(null);

  const [monsters, setMonsters] = useState([]);
  const [originalMonsters, setOriginalMonsters] = useState([]); // To keep original monster list for reset
  const [editMode, setEditMode] = useState(false);
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(''); // 'add' or 'edit' or 'view'

  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueElementals, setUniqueElementals] = useState([]);

  const [selectedSort, setSelectedSort] = useState(""); // Track selected sort option
  const [selectedFilters, setSelectedFilters] = useState({
    type: null,
    elemental: null,
  }); // Track selected filters

  const [dropdownVisible, setDropdownVisible] = useState({
    sort: false,
    filterType: false,
    filterElemental: false,
  });

  useEffect(() => {
    fetchMonsters();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible({
          sort: false,
          filterType: false,
          filterElemental: false,
        });
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function fetchMonsters() {
    try {
      const data = await fetch(`${API_BASE}/monsters`);
      const monsters = await data.json();
      setMonsters(monsters);
      setOriginalMonsters(monsters); // Save the original list for reset

      setUniqueTypes([...new Set(monsters.map(m => m.type))]);
      setUniqueElementals([...new Set(monsters.map(m => m.elemental || "none"))]); // Handle null as 'none'
    } catch (error) {
      console.error("Error fetching monsters:", error);
    }
  }

  function convertHpToNumber(hpString) {
    return parseInt(hpString.replace(/[^\d]/g, "")); // Remove non-numeric characters and convert to number
  }

  function handleSortBy(attribute) {
    setSelectedSort(attribute);
    const sortedMonsters = [...monsters].sort((a, b) => {
      if (attribute === "name") {
        return a[attribute].localeCompare(b[attribute]);
      } else if (attribute === "hp") {
        return convertHpToNumber(a[attribute]) - convertHpToNumber(b[attribute]);
      }
    });
    setMonsters(sortedMonsters);
  }

  function undoSort() {
    setSelectedSort("");
    applyFilters();
  }

  function handleFilterBy(criteria, value) {
    const newFilters = { ...selectedFilters };

    if (selectedFilters[criteria] === value) {
      newFilters[criteria] = null;
    } else {
      newFilters[criteria] = value;
    }

    setSelectedFilters(newFilters);
    applyFilters(newFilters);
  }

  function applyFilters(filters = selectedFilters) {
    let filteredMonsters = [...originalMonsters];

    if (filters.type) {
      filteredMonsters = filteredMonsters.filter(monster => monster.type === filters.type);
    }

    if (filters.elemental) {
      filteredMonsters = filteredMonsters.filter(monster => (monster.elemental || "none") === filters.elemental);
    }

    setMonsters(filteredMonsters);
  }

  function undoFilter() {
    setSelectedFilters({ type: null, elemental: null });
    setMonsters(originalMonsters);
  }

  function startEditMode(monster) {
    reset(monster);
    setSelectedMonster(monster);
    setPopupType('edit');
    setShowPopup(true);
  }

  function stopEditMode() {
    reset({
      name: "",
      type: "",
      elemental: "",
      hp: "",
      description: "",
      img: "",
    });
    setEditMode(false);
    setSelectedMonster(null);
    setShowPopup(false);
  }

  function handleMonsterFormSubmit(data) {
    const method = popupType === 'edit' ? "PUT" : "POST";
    const url = popupType === 'edit' ? `${API_BASE}/monsters/${selectedMonster.id}` : `${API_BASE}/monsters`;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      fetchMonsters();
      stopEditMode();
    });
  }

  async function deleteMonster(monster) {
    if (!confirm(`Are you sure to delete [${monster.name}]`)) return;

    try {
      const res = await fetch(`${API_BASE}/monsters/${monster.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchMonsters();
      } else {
        const errorData = await res.json();
        console.error('Delete failed:', errorData.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error deleting monster:', error);
    }
  }

  function viewMonsterInfo(monster) {
    setSelectedMonster(monster);
    setPopupType('view');
    setShowPopup(true);
  }

  function closePopup() {
    setShowPopup(false);
    setSelectedMonster(null);
  }

  const toggleDropdown = (type) => {
    setDropdownVisible({
      ...dropdownVisible,
      [type]: !dropdownVisible[type],
    });
  };

  return (
    <div className="container mx-auto py-8" ref={dropdownRef}>
      <div className="flex justify-between items-center mb-8">
        <Link href="/">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
            Back
          </button>
        </Link>
        <h1 className="text-3xl font-bold">Genshin Impact Monsters</h1>
      </div>

      <button onClick={() => { setPopupType('add'); setShowPopup(true); }} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
        Add New Monster
      </button>

      <div className="flex justify-between mb-4 mt-4">
        <div className="relative inline-block text-left">
          <button onClick={() => toggleDropdown("sort")} className={`px-2 py-2 rounded-md ${selectedSort ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white'} hover:bg-blue-700`}>
            Sort By
          </button>
          {dropdownVisible.sort && (
            <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg">
              <button className={`block px-4 py-2 ${selectedSort === "name" ? 'bg-gray-300' : 'text-gray-800 hover:bg-gray-200'}`} onClick={() => handleSortBy("name")}>
                Name
              </button>
              <button className={`block px-4 py-2 ${selectedSort === "hp" ? 'bg-gray-300' : 'text-gray-800 hover:bg-gray-200'}`} onClick={() => handleSortBy("hp")}>
                HP
              </button>
              <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={undoSort}>
                Undo Sort
              </button>
            </div>
          )}
        </div>

        <div className="relative inline-block text-left">
          <button onClick={() => toggleDropdown("filterType")} className={`px-2 py-2 rounded-md ${selectedFilters.type ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white'} hover:bg-blue-700`}>
            Filter by Type
          </button>
          {dropdownVisible.filterType && (
            <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg">
              {uniqueTypes.map((type) => (
                <button key={type} className={`block px-4 py-2 ${selectedFilters.type === type ? 'bg-gray-300' : 'text-gray-800 hover:bg-gray-200'}`} onClick={() => handleFilterBy("type", type)}>
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative inline-block text-left">
          <button onClick={() => toggleDropdown("filterElemental")} className={`px-2 py-2 rounded-md ${selectedFilters.elemental ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white'} hover:bg-blue-700`}>
            Filter by Elemental
          </button>
          {dropdownVisible.filterElemental && (
            <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg">
              {uniqueElementals.map((elemental) => (
                <button key={elemental} className={`block px-4 py-2 ${selectedFilters.elemental === elemental ? 'bg-gray-300' : 'text-gray-800 hover:bg-gray-200'}`} onClick={() => handleFilterBy("elemental", elemental)}>
                  {elemental}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={undoFilter} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
          Undo Filter
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {monsters.map((monster) => (
          <div key={monster.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="flex justify-end space-x-2 p-2">
              <button onClick={() => deleteMonster(monster)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                Delete
              </button>
              <button onClick={() => startEditMode(monster)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                Edit
              </button>
            </div>
            <Image
              src={monster.img}
              alt={monster.name}
              width={500} // you can set appropriate width
              height={200} // you can set appropriate height
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-black text-xl font-semibold">{monster.name}</h2>
              <p className="text-gray-600">Type: {monster.type}</p>
              <p className="text-gray-600">Elemental: {monster.elemental || 'None'}</p>
              <p className="text-gray-600">HP: {monster.hp}</p>
              <button onClick={() => viewMonsterInfo(monster)} className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-700">
                View Info
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <button onClick={closePopup} className="absolute top-2 right-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
              Close
            </button>
            {popupType === 'view' && selectedMonster && (
              <>
                <Image
                  src={monster.img}
                  alt={monster.name}
                  width={500} // you can set appropriate width
                  height={200} // you can set appropriate height
                  className="w-full h-48 object-cover"
                />
                <h2 className="text-black text-2xl font-bold text-center">{selectedMonster.name}</h2>
                <p className="text-gray-700 text-center mt-2">{selectedMonster.description}</p>
                <div className="mt-4 space-y-2 text-center">
                  <p className="text-black"><strong>Type:</strong> {selectedMonster.type}</p>
                  <p className="text-black"><strong>Elemental:</strong> {selectedMonster.elemental || 'None'}</p>
                  <p className="text-black"><strong>HP:</strong> {selectedMonster.hp}</p>
                </div>
              </>
            )}

            {(popupType === 'add' || popupType === 'edit') && (
              <form onSubmit={handleSubmit(handleMonsterFormSubmit)}>
                <h2 className="text-black text-2xl font-bold mb-4">{popupType === 'add' ? 'Add New Monster' : 'Edit Monster'}</h2>
                <div className="space-y-4">
                  <input name="name" defaultValue={selectedMonster?.name || ''} placeholder="Name" {...register("name")} className="w-full p-2 border rounded-md text-gray-900" required />
                  <input name="type" defaultValue={selectedMonster?.type || ''} placeholder="Type" {...register("type")} className="w-full p-2 border rounded-md text-gray-900" required />
                  <input name="elemental" defaultValue={selectedMonster?.elemental || ''} placeholder="Elemental" {...register("elemental")} className="w-full p-2 border rounded-md text-gray-900" />
                  <input name="hp" defaultValue={selectedMonster?.hp || ''} placeholder="HP" {...register("hp")} className="w-full p-2 border rounded-md text-gray-900" required />
                  <textarea name="description" defaultValue={selectedMonster?.description || ''} placeholder="Description" {...register("description")} className="w-full p-2 border rounded-md text-gray-900" required />
                  <input name="img" defaultValue={selectedMonster?.img || ''} placeholder="Image URL" {...register("img")} className="w-full p-2 border rounded-md text-gray-900" required />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-700">
                  {popupType === 'add' ? 'Add Monster' : 'Save Changes'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}