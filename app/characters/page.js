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
        <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="62" height="61" viewBox="0 0 62 61" fill="none">
        <path d="M30.9883 6.33188e-05C30.656 0.00356332 30.3471 0.171903 30.1641 0.449283L27.1641 5.00787C26.904 5.40414 26.9578 5.92855 27.293 6.26373L28 6.97076V7.69732C24.9852 7.86033 22.2782 8.26399 20.1309 8.84966C18.7113 9.23683 17.5352 9.69417 16.6367 10.2735C15.7382 10.8528 15 11.6468 15 12.7071C15 13.3921 15.3398 14.0002 15.7891 14.459C16.2383 14.9179 16.8125 15.2809 17.4941 15.6094C17.8969 15.8035 18.352 15.9805 18.832 16.1485C17.1715 17.4708 15.7441 19.0622 14.6367 20.8711C14.7214 20.7424 14.6316 20.8732 14.5742 20.9434C14.5151 21.0157 14.4514 21.0895 14.377 21.1934L9.60547 27.8262C9.60151 27.8314 9.59761 27.8366 9.59375 27.8419C7.85943 30.3525 4.6009 31.2686 1.8125 30.0294C1.81185 30.0287 1.8112 30.0281 1.81055 30.0274L1.50391 29.8926C1.07148 29.7009 0.563882 29.8384 0.287302 30.2221C0.0107217 30.6059 0.0407917 31.1309 0.359382 31.4805L0.833992 32.002C2.4315 33.7587 4.45575 34.6974 6.54688 35.1192C6.66019 35.2592 6.80216 35.369 6.97461 35.4317L5.28711 43.754C2.99997 55.0203 14.952 63.9664 25.1172 58.5997C25.5186 58.3862 25.7255 57.9289 25.6209 57.4865C25.5162 57.0441 25.1264 56.7279 24.6719 56.7169C23.4109 56.6906 22.2536 56.3742 21.1641 55.9434C22.0708 55.8381 22.9837 55.7767 23.8691 55.3379L26.2813 54.1426C26.3668 54.0995 26.4458 54.0442 26.5156 53.9786L30.252 55.6778C30.5139 55.7968 30.7953 55.8575 31.0781 55.8575C31.361 55.8575 31.6469 55.7964 31.9102 55.6758L35.5391 54.0255C35.5946 54.0708 35.6548 54.1101 35.7188 54.1426L38.1309 55.338C39.0163 55.7767 39.9292 55.8381 40.8359 55.9434C39.7464 56.3742 38.5891 56.6887 37.3281 56.7149C36.8719 56.7235 36.4793 57.0399 36.3739 57.4839C36.2685 57.9279 36.4771 58.387 36.8809 58.5997C47.047 63.9664 59.0001 55.0173 56.7129 43.752L54.9785 35.213C57.27 34.8644 59.5194 33.9195 61.2637 32.002L61.2656 32.0001L61.7383 31.4825C62.0583 31.1327 62.0888 30.6063 61.8112 30.222C61.5337 29.8376 61.0245 29.7009 60.5918 29.8946L60.2891 30.0294C57.5008 31.2686 54.2401 30.3523 52.5059 27.8419C52.502 27.8366 52.4981 27.8314 52.4942 27.8262L47.7246 21.1993L47.7207 21.1934C47.6676 21.1192 47.6493 21.1116 47.6074 21.0665C47.5851 21.0291 47.5603 20.9932 47.5332 20.9591C47.3505 20.7282 47.1603 20.4828 46.9434 20.2286C46.9427 20.2279 46.9421 20.2273 46.9414 20.2266C46.8555 20.1264 46.7948 20.0651 46.752 20.0177C45.737 18.5734 44.5122 17.2789 43.1211 16.17C43.5974 16.0045 44.0478 15.8292 44.4492 15.6388C45.1472 15.3077 45.7322 14.9413 46.1914 14.4786C46.6507 14.0159 47 13.4017 47 12.7071C47 11.6469 46.2618 10.8528 45.3633 10.2735C44.4648 9.69419 43.2887 9.23686 41.8692 8.84968C39.7219 8.26401 37.0149 7.86035 34 7.69734V6.97078L34.7071 6.26375C35.0422 5.92857 35.096 5.40417 34.836 5.00789L31.836 0.449303C31.6484 0.164973 31.3289 -0.00432668 30.9883 6.33188e-05ZM22.4121 1.98444C22.13 1.99987 21.8675 2.13393 21.6897 2.35348C21.5118 2.57303 21.4351 2.85758 21.4785 3.13678L21.7559 5.11725C21.7988 5.47679 22.0328 5.78502 22.3676 5.92308C22.7023 6.06114 23.0855 6.00747 23.3695 5.78277C23.6534 5.55807 23.7938 5.19743 23.7363 4.83991L23.459 2.85944C23.394 2.33806 22.9367 1.95584 22.4121 1.98444ZM39.5566 1.98444C39.0438 1.97247 38.605 2.35046 38.541 2.85944L38.2637 4.83991C38.2062 5.19743 38.3466 5.55807 38.6305 5.78277C38.9145 6.00747 39.2977 6.06114 39.6324 5.92308C39.9672 5.78502 40.2012 5.47679 40.2441 5.11725L40.5215 3.13678C40.5654 2.85238 40.4846 2.56286 40.2999 2.34222C40.1151 2.12158 39.8443 1.99122 39.5566 1.98444ZM31 2.82037L32.7168 5.42584L32.293 5.84967C32.1054 6.03718 32.0001 6.2915 32 6.5567V7.64264C31.6632 7.63665 31.3424 7.6153 31 7.6153C30.6576 7.6153 30.3368 7.63665 30 7.64264V6.5567C30 6.2915 29.8946 6.03718 29.707 5.84967L29.2832 5.42584L31 2.82037ZM16.9199 3.20709C16.6025 3.21105 16.3057 3.36552 16.1204 3.62329C15.9351 3.88107 15.8831 4.21153 15.9805 4.51373L16.5684 6.42584C16.6733 6.76748 16.9526 7.02715 17.3009 7.10703C17.6493 7.1869 18.0138 7.07483 18.2571 6.81305C18.5004 6.55126 18.5856 6.17955 18.4805 5.83795L17.8926 3.92584C17.7664 3.49515 17.3687 3.20129 16.9199 3.20709ZM45.0508 3.20709C44.6129 3.21427 44.2306 3.50554 44.1074 3.92584L43.5195 5.83795C43.4144 6.17954 43.4996 6.55126 43.7429 6.81305C43.9862 7.07484 44.3507 7.1869 44.6991 7.10703C45.0474 7.02716 45.3267 6.76748 45.4316 6.42584L46.0195 4.51373C46.1185 4.20661 46.0632 3.87062 45.871 3.61142C45.6788 3.35222 45.3734 3.20166 45.0508 3.20709ZM11.6875 5.32037C11.3345 5.31306 11.0038 5.4924 10.8174 5.79225C10.631 6.09209 10.6165 6.46801 10.7793 6.78131L11.6777 8.56842C11.8316 8.89856 12.1527 9.11897 12.516 9.14383C12.8794 9.16868 13.2275 8.99404 13.4249 8.68792C13.6222 8.3818 13.6375 7.99261 13.4649 7.67193L12.5684 5.88287C12.4039 5.54466 12.0635 5.32733 11.6875 5.32037ZM50.2832 5.32037C49.9178 5.33803 49.5913 5.55375 49.4316 5.88287L48.5352 7.67193C48.3625 7.99261 48.3778 8.3818 48.5751 8.68792C48.7725 8.99404 49.1206 9.16868 49.484 9.14383C49.8473 9.11898 50.1685 8.89856 50.3223 8.56842L51.2207 6.78131C51.3864 6.46328 51.3691 6.08088 51.1755 5.77906C50.9818 5.47725 50.6413 5.30224 50.2832 5.32037ZM55.1836 8.26373C54.8539 8.2611 54.5441 8.42111 54.3555 8.69146L53.1856 10.3126C52.9626 10.6015 52.9147 10.9889 53.0606 11.3235C53.2065 11.658 53.5231 11.8865 53.8866 11.9196C54.2501 11.9527 54.6027 11.7851 54.8066 11.4825L55.9766 9.86138C56.2016 9.55937 56.2379 9.15653 56.0705 8.81916C55.903 8.48179 55.5602 8.2671 55.1836 8.26373ZM6.78516 8.26569C6.41486 8.28091 6.08333 8.49965 5.92368 8.83411C5.76402 9.16857 5.80242 9.5639 6.02344 9.86139L7.19336 11.4825C7.39732 11.7852 7.74996 11.9527 8.11343 11.9196C8.4769 11.8865 8.79348 11.658 8.93941 11.3235C9.08534 10.989 9.03745 10.6015 8.81446 10.3126L7.64454 8.69147C7.44925 8.41249 7.12542 8.25205 6.78516 8.26569ZM31 9.61529C35.0683 9.61529 38.7538 10.073 41.3438 10.7794C42.6387 11.1326 43.6597 11.5556 44.2793 11.9551C44.8989 12.3547 45 12.6378 45 12.7071C45 12.7515 44.9893 12.8529 44.7734 13.0704C44.5576 13.2878 44.1529 13.5659 43.5918 13.8321C43.1118 14.0598 42.1598 14.2146 41.4766 14.42C41.4861 14.3588 41.5449 14.341 41.5449 14.2754C41.5449 13.7559 41.2332 13.3858 40.9766 13.1797C40.7199 12.9737 40.4551 12.8485 40.1563 12.7325C39.5586 12.5004 38.816 12.3282 37.9121 12.1797C36.1045 11.8828 33.6799 11.7071 31 11.7071C30.33 11.7071 29.6754 11.7172 29.043 11.7383C29.0235 11.7371 29.0039 11.7365 28.9844 11.7364C28.9399 11.7373 28.8955 11.7412 28.8516 11.7481C27.0339 11.8154 25.3963 11.9648 24.0879 12.1797C23.1841 12.3282 22.4414 12.5004 21.8438 12.7325C21.545 12.8485 21.2801 12.9737 21.0235 13.1797C20.7668 13.3858 20.4551 13.7559 20.4551 14.2754C20.4551 14.343 20.5154 14.361 20.5254 14.4239C19.8171 14.2112 18.8509 14.0446 18.3614 13.8087C17.8167 13.5462 17.4266 13.2729 17.2188 13.0606C17.011 12.8483 17 12.7506 17 12.7071C17 12.6378 17.1011 12.3547 17.7207 11.9551C18.3404 11.5556 19.3613 11.1326 20.6563 10.7794C23.2462 10.073 26.9317 9.61529 31 9.61529ZM31 13.9669C31.3358 13.9669 31.6692 13.9778 32 13.9962V16.793C32.0001 17.0582 32.1054 17.3126 32.293 17.5001L33.2168 18.4239L31 21.7891L28.7832 18.4239L29.707 17.5001C29.8946 17.3126 30 17.0582 30 16.793V13.9981C30.3309 13.9804 30.6639 13.9669 31 13.9669ZM28 14.2208V16.379L26.793 17.586C26.4568 17.9215 26.4029 18.4471 26.6641 18.8438L30.1641 24.1583C30.349 24.4398 30.6632 24.6093 31 24.6093C31.3368 24.6093 31.651 24.4398 31.8359 24.1583L35.3359 18.8438C35.5971 18.4471 35.5432 17.9215 35.207 17.586L34 16.379V14.2247C34.9539 14.387 35.8787 14.6263 36.7695 14.9337C36.5978 15.1349 36.4629 15.3967 36.4629 15.7422C36.4629 16.4408 36.9676 16.8128 37.3281 16.9844C37.6887 17.156 38.0624 17.2227 38.4688 17.2227C38.5976 17.2227 38.6933 17.2046 38.7969 17.1915C38.8564 17.1929 38.9158 17.1889 38.9746 17.1797C39.5644 17.0814 40.1259 16.9721 40.6641 16.8536C42.4379 18.0284 43.9687 19.5116 45.1621 21.2266C45.1832 21.2578 45.206 21.2878 45.2305 21.3165C45.321 21.4193 45.3871 21.4845 45.4238 21.5274C45.5713 21.7003 45.7207 21.8893 45.8731 22.0821C45.8731 22.0827 45.8731 22.0834 45.8731 22.084C45.9187 22.1672 45.9759 22.2435 46.043 22.3106C46.1194 22.387 46.1267 22.4048 46.0918 22.3555C46.0937 22.3575 46.0957 22.3594 46.0977 22.3614L50.8594 28.9786L50.8613 28.9805C52.3756 31.1709 54.807 32.3332 57.332 32.4571C56.1987 33.0458 55.0012 33.4307 53.7656 33.4844C53.7224 33.4868 53.6793 33.4921 53.6367 33.5001H51.7285C49.2465 33.5001 46.8387 32.7295 44.7637 31.2715C44.3127 30.9525 43.6861 31.0627 43.3691 31.5137C43.0521 31.9667 43.1613 32.5913 43.6133 32.9083C46.0263 34.6043 48.8325 35.5001 51.7285 35.5001H52.9961L54.7519 44.1504C56.5014 52.7672 48.7944 59.6532 40.9062 57.9336C42.6473 57.3532 44.2343 56.5102 45.5137 55.2852C45.5253 55.2791 45.5373 55.2738 45.5488 55.2676V55.2657C48.9743 53.4464 51.109 49.8241 50.9961 45.9024L50.9024 42.6426C50.8984 42.3722 50.785 42.1149 50.5881 41.9294C50.3913 41.7439 50.1276 41.6461 49.8574 41.6582C49.3057 41.6826 48.8781 42.1495 48.9024 42.7012L48.9961 45.961C49.0911 49.2611 47.2131 52.2735 44.2383 53.67C42.6562 54.3653 40.8021 54.4292 39.0176 53.545L38.4707 53.2735C39.4164 52.7981 40.2643 52.1814 40.9981 51.4629C41.993 50.8011 42.7396 49.8132 43.082 48.6504L43.2383 48.1192C43.4454 47.5974 43.6048 47.0557 43.7149 46.5L43.7774 46.2832C43.823 46.1429 43.837 45.9941 43.8184 45.8477C43.9532 44.7594 43.8978 43.6269 43.6152 42.4864L41.9375 35.7188C41.8692 35.4408 41.685 35.2055 41.4317 35.0723C39.3964 34.0063 37.2648 32.3152 35.3789 30.1094C34.5343 29.1219 33.803 28.0993 33.1778 27.0723C32.9376 26.6782 32.4589 26.4996 32.0193 26.6401C31.5797 26.7806 31.2933 27.2037 31.3262 27.6641C31.5453 30.6596 32.3978 33.3552 33.5332 35.8028C28.9182 34.4917 25.3439 30.8622 24.5391 26.2071C24.4601 25.7499 24.077 25.4071 23.6138 25.3791C23.1507 25.3512 22.7291 25.6455 22.5957 26.0899L21.75 28.9082C21.7458 28.9238 21.7418 28.9394 21.7383 28.9551L18.3848 42.4864C17.7985 44.853 18.1835 47.1853 19.2539 49.1524C19.5485 49.8678 20.001 50.5004 20.5703 51.0118C21.3938 51.9269 22.3896 52.7033 23.5274 53.2754L22.9805 53.5469C21.196 54.4311 19.3435 54.3655 17.7618 53.67C14.787 52.2735 12.9089 49.2611 13.0039 45.961L13.0977 42.7012C13.1093 42.431 13.011 42.1676 12.8252 41.9711C12.6393 41.7746 12.3818 41.6617 12.1114 41.6582C11.5598 41.6507 11.1063 42.0911 11.0977 42.6426L11.004 45.9024C10.891 49.8241 13.0257 53.4464 16.4512 55.2657L16.4493 55.2696C16.454 55.272 16.4595 55.2726 16.4649 55.2735C16.4726 55.2776 16.4806 55.2811 16.4883 55.2852C17.7669 56.5093 19.3504 57.3533 21.0899 57.9337C13.2029 59.652 5.49682 52.7675 7.24615 44.1505L9.00396 35.5001H9.27154C10.3605 35.5001 11.4526 35.3703 12.5176 35.1153C13.0546 34.9863 13.3859 34.4453 13.2579 33.9083C13.1289 33.3733 12.5888 33.044 12.0528 33.17C11.1388 33.389 10.2035 33.5001 9.27153 33.5001H8.29106C8.27483 33.4977 8.25855 33.4958 8.24223 33.4942C7.03145 33.4262 5.8608 33.0414 4.75004 32.459C7.282 32.3409 9.72018 31.1766 11.2383 28.9805L16.002 22.3594C16.0026 22.3588 16.0033 22.3581 16.0039 22.3575C16.0025 22.3595 16.0667 22.278 16.1231 22.209C16.1795 22.14 16.1794 22.1648 16.3086 21.9688C16.3153 21.9592 16.3218 21.9494 16.3282 21.9395C17.5695 19.9027 19.2634 18.1665 21.2774 16.836C21.7673 16.9448 22.2796 17.0463 22.8125 17.1387C23.0018 17.1834 23.2197 17.2227 23.4688 17.2227C23.8757 17.2227 24.2512 17.1561 24.6114 16.9844C24.9715 16.8127 25.4747 16.4424 25.4747 15.7422C25.4747 15.4043 25.331 15.125 25.1661 14.9278C26.0754 14.6169 27.023 14.3825 28 14.2208ZM39.834 26.9825C39.5781 26.9805 39.322 27.077 39.125 27.2715C38.732 27.6595 38.7272 28.2916 39.1152 28.6856L40.5195 30.1094C40.7145 30.3074 40.9725 30.4063 41.2305 30.4063C41.4845 30.4063 41.7396 30.3122 41.9336 30.1192C42.3266 29.7312 42.3314 29.0991 41.9434 28.7051L40.5391 27.2813C40.3456 27.0848 40.0899 26.9845 39.834 26.9825ZM23.6367 29.5997C25.6172 34.2128 29.8649 37.6536 35.1191 38.3243C34.9046 38.7582 34.7695 39.2407 34.7695 39.7637V41.0938C34.7695 41.2934 34.7973 41.4865 34.834 41.6661C35.0866 43.222 36.4383 44.3801 38.0273 44.4239C38.0364 44.424 38.0456 44.424 38.0547 44.4239H38.1172C39.6035 44.4239 40.9225 43.4156 41.3184 41.9669L41.375 41.7598L41.6738 42.9669C41.9135 43.9342 41.9498 44.9003 41.8262 45.8282L41.1621 48.0841C41.1527 48.1161 41.1354 48.1442 41.125 48.1759C41.1243 48.1781 41.1218 48.1795 41.1211 48.1817C40.9145 48.6025 40.6665 49.003 40.3867 49.379C40.12 49.6516 39.8131 49.8872 39.457 50.0489L31.0781 53.8575H31.0762L22.7012 50.0489C21.8723 49.6724 21.2533 48.9594 20.9961 48.086L20.1992 45.3848C20.1781 45.3114 20.1486 45.2406 20.1113 45.1739C20.0781 44.4498 20.1424 43.7086 20.3262 42.9669L20.6992 41.461L20.8379 41.9669C21.2336 43.4166 22.5534 44.4239 24.0391 44.4239H24.1016C24.1107 44.424 24.1198 44.424 24.1289 44.4239C25.7179 44.3802 27.0697 43.222 27.3223 41.6661C27.359 41.4865 27.3867 41.2934 27.3867 41.0938V39.7637C27.3867 38.0271 26.0362 36.6662 24.4492 36.4571C23.9202 36.3874 23.3646 36.4452 22.8242 36.6602L22.5098 36.7794C22.5058 36.7807 22.5019 36.782 22.498 36.7833C22.2239 36.8914 21.9804 37.0437 21.7519 37.213L23.6367 29.5997ZM17.709 30.4923C17.4544 30.4663 17.1891 30.5385 16.9746 30.713C16.4936 31.105 15.984 31.4625 15.459 31.7755C14.986 32.0595 14.8312 32.6745 15.1152 33.1485C15.3022 33.4605 15.6346 33.6348 15.9746 33.6348C16.1496 33.6348 16.3263 33.5873 16.4863 33.4923C17.0933 33.1283 17.6823 32.7158 18.2383 32.2618C18.6663 31.9138 18.7318 31.2835 18.3828 30.8555C18.2088 30.642 17.9636 30.5183 17.709 30.4923ZM34.0859 31.6329C35.9469 33.7555 38.0129 35.4113 40.0879 36.5684L40.2109 37.0665C40.0373 36.9567 39.8529 36.8607 39.6562 36.7833C39.6524 36.7819 39.6485 36.7806 39.6445 36.7794L39.332 36.6602C38.7917 36.4449 38.236 36.3855 37.707 36.4551C37.1797 36.5245 36.6843 36.7317 36.25 37.0274C36.2264 36.9564 36.195 36.8883 36.1562 36.8243C35.2426 35.3105 34.5865 33.5276 34.0859 31.6329ZM24.2305 38.4239C24.8702 38.4968 25.3867 39.0374 25.3867 39.7637V41.0938C25.3867 41.1592 25.3831 41.1948 25.3633 41.2852C25.3588 41.304 25.3549 41.3229 25.3516 41.3419C25.2563 41.9393 24.7341 42.4057 24.0742 42.4239H24.0391C23.4287 42.4239 22.9358 42.0558 22.7676 41.4395L22.5781 40.752C22.5775 40.7494 22.5768 40.7468 22.5762 40.7442L22.4356 40.2423C22.2457 39.5719 22.5881 38.8989 23.2324 38.6446L23.5489 38.5235C23.5541 38.5216 23.5593 38.5197 23.5645 38.5177C23.7906 38.4277 24.0172 38.3996 24.2305 38.4239ZM37.9238 38.4239C38.1369 38.3998 38.3637 38.4275 38.5899 38.5176C38.595 38.5196 38.6003 38.5216 38.6055 38.5235L38.9238 38.6446C39.5705 38.8993 39.9111 39.5702 39.7207 40.2403C39.7207 40.2409 39.7207 40.2416 39.7207 40.2422L39.5801 40.7442C39.5794 40.7468 39.5788 40.7494 39.5782 40.752L39.3887 41.4395C39.2206 42.0548 38.7269 42.4239 38.1172 42.4239H38.0821C37.4222 42.4057 36.9 41.9393 36.8047 41.3419C36.8014 41.3229 36.7974 41.304 36.793 41.2852C36.7731 41.1948 36.7696 41.1592 36.7696 41.0938V39.7637C36.7696 39.036 37.2847 38.4963 37.9238 38.4239ZM27.9492 44.0352C27.397 44.0353 26.9493 44.483 26.9492 45.0352V46.7032C26.9492 48.7707 28.6484 50.4669 30.7149 50.4669H31.4434C33.5109 50.4669 35.207 48.7696 35.207 46.7032V45.0352C35.207 44.483 34.7593 44.0353 34.207 44.0352H27.9492ZM28.9492 46.0352H33.207V46.7032C33.207 47.6888 32.4299 48.4669 31.4434 48.4669H30.7148C29.7293 48.4669 28.9492 47.6897 28.9492 46.7032V46.0352Z" fill="#EDE9FE"/>
        </svg>
        <h1 className="text-3xl font-bold">Characters</h1>
      </div>
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