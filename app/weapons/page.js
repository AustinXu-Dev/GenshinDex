"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Link from 'next/link';

export default function WeaponPage() {
  const API_BASE = "/api";
  const { register, handleSubmit, reset } = useForm();
  const dropdownRef = useRef(null);

  const [weapons, setWeapons] = useState([]);
  const [originalWeapons, setOriginalWeapons] = useState([]); // To keep original weapon list for reset
  const [editMode, setEditMode] = useState(false);
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(''); // 'add' or 'edit' or 'view'

  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [selectedSort, setSelectedSort] = useState(""); // Track selected sort option
  const [selectedFilters, setSelectedFilters] = useState({
    type: null,
  }); // Track selected filters

  const [dropdownVisible, setDropdownVisible] = useState({
    sort: false,
    filterType: false,
  });

  useEffect(() => {
    fetchWeapons();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible({
          sort: false,
          filterType: false,
        });
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function fetchWeapons() {
    try {
      const data = await fetch(`${API_BASE}/weapons`);
      const weapons = await data.json();
      setWeapons(weapons);
      setOriginalWeapons(weapons); // Save the original list for reset

      // Generate unique filter options
      setUniqueTypes([...new Set(weapons.map(w => w.type))]);
    } catch (error) {
      console.error("Error fetching weapons:", error);
    }
  }

  function convertBaseAttackToNumber(baseAttack) {
    return parseInt(baseAttack.split(' ')[0]); // Extract number before first space and convert to integer
  }

  // Handle sorting by name (string), rarity (integer), or baseattack (integer)
  function handleSortBy(attribute) {
    setSelectedSort(attribute);

    const sortedWeapons = [...weapons].sort((a, b) => {
      if (attribute === "name") {
        return a[attribute].localeCompare(b[attribute]);
      } else if (attribute === "rarity" || attribute === "baseattack") {
        const aValue = attribute === "baseattack" ? convertBaseAttackToNumber(a[attribute]) : a[attribute];
        const bValue = attribute === "baseattack" ? convertBaseAttackToNumber(b[attribute]) : b[attribute];
        return aValue - bValue;
      }
    });
    setWeapons(sortedWeapons);
  }

  // Undo sort
  function undoSort() {
    setSelectedSort("");
    applyFilters();
  }

  // Handle filtering by type
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

  // Apply all selected filters to the weapon list
  function applyFilters(filters = selectedFilters) {
    let filteredWeapons = [...originalWeapons];

    // Apply type filter
    if (filters.type) {
      filteredWeapons = filteredWeapons.filter(weapon => weapon.type === filters.type);
    }

    setWeapons(filteredWeapons);
  }

  // Undo all filters (reset everything)
  function undoFilter() {
    setSelectedFilters({ type: null });
    setWeapons(originalWeapons);
  }

  // Start edit mode with selected weapon data
  function startEditMode(weapon) {
    reset(weapon);
    setSelectedWeapon(weapon);
    setPopupType('edit');
    setShowPopup(true);
  }

  // Stop edit mode and reset form
  function stopEditMode() {
    reset({
      name: "",
      type: "",
      rarity: "",
      baseattack: "",
      substat: "",
      "passive ability": "",
      image: "",
    });
    setEditMode(false);
    setSelectedWeapon(null);
    setShowPopup(false);
  }

  // Submit the form for adding or editing a weapon
  function handleWeaponFormSubmit(data) {
    const method = popupType === 'edit' ? "PUT" : "POST";
    const url = popupType === 'edit' ? `${API_BASE}/weapons/${selectedWeapon.id}` : `${API_BASE}/weapons`;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      fetchWeapons();
      stopEditMode();
    });
  }

  // Delete a weapon
  async function deleteWeapon(weapon) {
    if (!confirm(`Are you sure to delete [${weapon.name}]`)) return;

    try {
      const id = weapon.id;
      const res = await fetch(`${API_BASE}/weapons/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchWeapons(); // Refresh the weapons list after deletion
      } else {
        const errorData = await res.json();
        console.error('Delete failed:', errorData.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error deleting weapon:', error);
    }
  }

  // View weapon info
  function viewWeaponInfo(weapon) {
    setSelectedWeapon(weapon);
    setPopupType('view');
    setShowPopup(true);
  }

  // Close pop-up
  function closePopup() {
    setShowPopup(false);
    setSelectedWeapon(null);
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
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
            Back
          </button>
        </Link>
        <h1 className="text-3xl font-bold">Genshin Impact Weapons</h1>
      </div>

      {/* Add New Button */}
      <button onClick={() => { setPopupType('add'); setShowPopup(true); }} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
        Add New Weapon
      </button>

      {/* Dropdowns for Sorting and Filtering */}
      <div className="flex justify-between mb-4 mt-4">
        {/* Sort By Dropdown */}
        <div className="relative inline-block text-left">
          <button onClick={() => toggleDropdown("sort")} className={`px-2 py-2 rounded-md ${selectedSort ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white'} hover:bg-blue-700`}>
            Sort By
          </button>
          {dropdownVisible.sort && (
            <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg">
              <button className={`block px-4 py-2 ${selectedSort === "name" ? 'bg-gray-300' : 'text-gray-800 hover:bg-gray-200'}`} onClick={() => handleSortBy("name")}>
                Name
              </button>
              <button className={`block px-4 py-2 ${selectedSort === "rarity" ? 'bg-gray-300' : 'text-gray-800 hover:bg-gray-200'}`} onClick={() => handleSortBy("rarity")}>
                Rarity
              </button>
              <button className={`block px-4 py-2 ${selectedSort === "baseattack" ? 'bg-gray-300' : 'text-gray-800 hover:bg-gray-200'}`} onClick={() => handleSortBy("baseattack")}>
                Base Attack
              </button>
              <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={undoSort}>
                Undo Sort
              </button>
            </div>
          )}
        </div>

        {/* Filter By Type Dropdown */}
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

        {/* Undo Filter Button */}
        <button onClick={undoFilter} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
          Undo Filter
        </button>
      </div>

      {/* Weapon Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {weapons.map((weapon) => (
          <div key={weapon.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="flex justify-end space-x-2 p-2">
              <button onClick={() => deleteWeapon(weapon)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                Delete
              </button>
              <button onClick={() => startEditMode(weapon)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                Edit
              </button>
            </div>
            <img src={weapon.image} alt={weapon.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-black text-xl font-semibold">{weapon.name}</h2>
              <p className="text-gray-600">Type: {weapon.type}</p>
              <button onClick={() => viewWeaponInfo(weapon)} className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-700">
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
            <button onClick={closePopup} className="absolute top-2 right-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
              Close
            </button>
            {popupType === 'view' && selectedWeapon && (
              <>
                <img src={selectedWeapon.image} alt={selectedWeapon.name} className="w-32 h-32 object-cover mx-auto" />
                <h2 className="text-black text-2xl font-bold text-center">{selectedWeapon.name}</h2>
                <p className="text-gray-700 text-center mt-2">{selectedWeapon["passive ability"] || 'None'}</p>
                <div className="mt-4 space-y-2 text-center">
                  <p className="text-black"><strong>Type:</strong> {selectedWeapon.type}</p>
                  <p className="text-black"><strong>Rarity:</strong> {selectedWeapon.rarity}</p>
                  <p className="text-black"><strong>Base Attack:</strong> {convertBaseAttackToNumber(selectedWeapon.baseattack)}</p>
                  <p className="text-black"><strong>Substat:</strong> {selectedWeapon.substat || 'None'}</p>
                </div>
              </>
            )}

            {(popupType === 'add' || popupType === 'edit') && (
              <form onSubmit={handleSubmit(handleWeaponFormSubmit)}>
                <h2 className="text-black text-2xl font-bold mb-4">{popupType === 'add' ? 'Add New Weapon' : 'Edit Weapon'}</h2>
                <div className="space-y-4">
                  <input name="name" defaultValue={selectedWeapon?.name || ''} placeholder="Name" {...register("name")} className="w-full p-2 border rounded-md text-gray-900" required />
                  <input name="type" defaultValue={selectedWeapon?.type || ''} placeholder="Type" {...register("type")} className="w-full p-2 border rounded-md text-gray-900" required />
                  <input name="rarity" type="number" defaultValue={selectedWeapon?.rarity || ''} placeholder="Rarity" {...register("rarity")} className="w-full p-2 border rounded-md text-gray-900" required />
                  <input name="baseattack" defaultValue={selectedWeapon?.baseattack || ''} placeholder="Base Attack" {...register("baseattack")} className="w-full p-2 border rounded-md text-gray-900" required />
                  <input name="substat" defaultValue={selectedWeapon?.substat || ''} placeholder="Substat" {...register("substat")} className="w-full p-2 border rounded-md text-gray-900" />
                  <textarea name="passive ability" defaultValue={selectedWeapon?.["passive ability"] || ''} placeholder="Passive Ability" {...register("passive ability")} className="w-full p-2 border rounded-md text-gray-900" />
                  <input name="image" defaultValue={selectedWeapon?.image || ''} placeholder="Image URL" {...register("image")} className="w-full p-2 border rounded-md text-gray-900" required />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-700">
                  {popupType === 'add' ? 'Add Weapon' : 'Save Changes'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}