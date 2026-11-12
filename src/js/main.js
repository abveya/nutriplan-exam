(function () {
    // DOM Elements & Constants
    let searchFilterSection = document.getElementById("search-filters-section");
    let mealCategoriesSection = document.getElementById("meal-categories-section");
    let logMeal = document.getElementById("log-meal-model");
    let allRecipesSection = document.getElementById("all-recipes-section");
    let mealDetailsSection = document.getElementById("meal-details");
    let productsSection = document.getElementById("products-section");
    let foodlogSection = document.getElementById("foodlog-section");
    let links = document.querySelectorAll(".nav-link");
    let backToMealsBtn = document.getElementById("back-to-meals-btn");
    let increseServing = document.getElementById("increase-serving");
    let decreaseServing = document.getElementById("decrease-serving");
    let numberOfServing = document.getElementById("number-of-serving");
    let listViewBtn = document.getElementById("list-view-btn");
    let gridViewBtn = document.getElementById("grid-view-btn");
    let recipesCount = document.getElementById("recipes-count");
    let logMealBtn = document.getElementById("log-meal-btn");
    let logMealLoadingBtn = document.getElementById("log-meal-btn-loading");
    let productSearchInput = document.getElementById("product-search-input");
    let nutriScoreFilter = document.querySelectorAll(".nutri-score-filter");
    let searchProductBtn = document.getElementById("search-product-btn");
    let barcodeInput = document.getElementById("barcode-input");
    let lookupBarcodeBtn = document.getElementById("lookup-barcode-btn");
    let productsCount = document.getElementById("products-count");
    let inputSearch = document.getElementById("search-input");
    const BASE_URL = `https://nutriplan-api.vercel.app/api`;
    let mealDetilsImg = document.querySelector("#meal-details img");
    let productCategories = document.getElementById("product-categories");
    function getFormattedDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }
    window.addEventListener("load", () => {
        document.getElementById("app-loading-overlay")?.classList.add("hidden");
    });
    // Routing & Sidebar
    function handleRoute() {
        let path = window.location.hash.slice(1) || "/home";
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        for (let i = 0; i < links.length; i++) {
            links[i].classList.remove("bg-emerald-50", "text-emerald-700");
            links[i].classList.add("text-gray-600", "hover:bg-gray-50");
        }
        if (!window.location.hash) {
            window.location.hash = "#/home";
        }
        if (path === "/home") {
            links[0].classList.add("bg-emerald-50", "text-emerald-700");
            links[0].classList.remove("text-gray-600", "hover:bg-gray-50");
            document.getElementById("main-heading").innerHTML = `Meals & Recipes`;
            document.getElementById("desc-heading").innerHTML =
                `Discover delicious and nutritious recipes tailored for you`;
            searchFilterSection.style = "";
            mealCategoriesSection.style = "";
            allRecipesSection.style = "";
            mealDetailsSection.style.display = "none";
            productsSection.style.display = "none";
            foodlogSection.style.display = "none";
        }
        else if (path === "/products") {
            links[1].classList.add("bg-emerald-50", "text-emerald-700");
            links[1].classList.remove("text-gray-600", "hover:bg-gray-50");
            document.getElementById("main-heading").innerHTML = `Product Scanner`;
            document.getElementById("desc-heading").innerHTML =
                `Search packaged foods by name or barcode`;
            searchFilterSection.style.display = "none";
            mealCategoriesSection.style.display = "none";
            allRecipesSection.style.display = "none";
            mealDetailsSection.style.display = "none";
            productsSection.style = "";
            foodlogSection.style.display = "none";
        }
        else if (path === "/foodlog") {
            links[2].classList.add("bg-emerald-50", "text-emerald-700");
            links[2].classList.remove("text-gray-600", "hover:bg-gray-50");
            document.getElementById("main-heading").innerHTML = `Food Log`;
            document.getElementById("desc-heading").innerHTML =
                `Track your daily nutrition and food intake`;
            searchFilterSection.style.display = "none";
            mealCategoriesSection.style.display = "none";
            allRecipesSection.style.display = "none";
            mealDetailsSection.style.display = "none";
            productsSection.style.display = "none";
            foodlogSection.style = "";
        }
        else if (path.startsWith("/meal/")) {
            links[0].classList.add("bg-emerald-50", "text-emerald-700");
            links[0].classList.remove("text-gray-600", "hover:bg-gray-50");
            document.getElementById("main-heading").innerHTML = `Recipe Details`;
            document.getElementById("desc-heading").innerHTML =
                `View full recipe information and nutrition facts`;
            searchFilterSection.style.display = "none";
            mealCategoriesSection.style.display = "none";
            allRecipesSection.style.display = "none";
            mealDetailsSection.style = "";
            productsSection.style.display = "none";
            foodlogSection.style.display = "none";
        }
    }
    window.addEventListener("hashchange", handleRoute);
    handleRoute();
    function handleSideBar() {
        for (let i = 0; i < links.length; i++) {
            links[i].addEventListener("click", function (event) {
                event.preventDefault();
                if (i === 0) {
                    window.location.hash = "#/home";
                }
                else if (i === 1) {
                    window.location.hash = "#/products";
                }
                else if (i === 2) {
                    window.location.hash = "#/foodlog";
                }
            });
        }
    }
    handleSideBar();
    document
        .getElementById("header-menu-btn")
        ?.addEventListener("click", function () {
        document.getElementById("sidebar-overlay").classList.add("active");
        document.getElementById("sidebar").classList.add("open");
    });
    document
        .getElementById("sidebar-close-btn")
        ?.addEventListener("click", function () {
        document.getElementById("sidebar-overlay").classList.remove("active");
        document.getElementById("sidebar").classList.remove("open");
    });
    for (let i = 0; i < links.length; i++) {
        links[i]?.addEventListener("click", function () {
            document.getElementById("sidebar-overlay").classList.remove("active");
            document.getElementById("sidebar").classList.remove("open");
        });
    }
    // Meals & Recipes
    let categories = [];
    let areas = [];
    let mealCategoryStyles = {
        Beef: {
            primaryColor: "red",
            secondColor: "rose",
            icon: "fa-drumstick-bite",
        },
        Chicken: {
            primaryColor: "amber",
            secondColor: "orange",
            icon: "fa-drumstick-bite",
        },
        Dessert: {
            primaryColor: "pink",
            secondColor: "rose",
            icon: "fa-cake-candles",
        },
        Lamb: {
            primaryColor: "orange",
            secondColor: "amber",
            icon: "fa-drumstick-bite",
        },
        Miscellaneous: {
            primaryColor: "slate",
            secondColor: "gray",
            icon: "fa-bowl-rice",
        },
        Pasta: {
            primaryColor: "yellow",
            secondColor: "amber",
            icon: "fa-bowl-food",
        },
        Pork: {
            primaryColor: "rose",
            secondColor: "red",
            icon: "fa-bacon",
        },
        Seafood: {
            primaryColor: "cyan",
            secondColor: "blue",
            icon: "fa-fish",
        },
        Side: {
            primaryColor: "green",
            secondColor: "emerald",
            icon: "fa-plate-wheat",
        },
        Starter: {
            primaryColor: "teal",
            secondColor: "cyan",
            icon: "fa-utensils",
        },
        Vegan: {
            primaryColor: "emerald",
            secondColor: "green",
            icon: "fa-leaf",
        },
        Vegetarian: {
            primaryColor: "lime",
            secondColor: "green",
            icon: "fa-seedling",
        },
    };
    function displayCategories() {
        let container = "";
        for (let i = 0; i < categories.length; i++) {
            let style = mealCategoryStyles[categories[i].name];
            if (i <= 11) {
                container += `
         <div
              class="category-card bg-gradient-to-br from-${style.primaryColor}-50 to-${style.secondColor}-50 rounded-xl p-3 border border-${style.primaryColor}-200 hover:border-${style.primaryColor}-400 hover:shadow-md cursor-pointer transition-all group"
              data-category='${categories[i].name}'
            >
              <div class="flex items-center gap-2.5">
                <div
                  class="text-white w-9 h-9 bg-gradient-to-br from-${style.primaryColor}-400 to-${style.secondColor}-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
                >
                  <i class="fa-solid ${style.icon}"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900">${categories[i].name}</h3>
                </div>
              </div>
            </div>
        `;
            }
        }
        document.getElementById("categories-grid").innerHTML = container;
    }
    async function getCategoryMeals() {
        let response = await fetch(`${BASE_URL}/meals/categories`);
        let data = await response.json();
        categories = data.results;
        displayCategories();
    }
    getCategoryMeals();
    function displayAreas() {
        let container = `<button
              class="area-btn px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 hover:scale-110 transition-all duration-300 transform"
            >
              All Recipes
            </button>`;
        for (let i = 0; i < areas.length; i++) {
            if (i < 11) {
                container += `
         <button
              class="area-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 hover:scale-110 transition-all duration-300 transform"
            >
              ${areas[i].name}
            </button>
      `;
            }
        }
        document.querySelector("#search-filters-section .flex.items-center").innerHTML = container;
        let areaButtons = document.querySelectorAll(".area-btn");
        for (let j = 0; j < areaButtons.length; j++) {
            areaButtons[j].addEventListener("click", function () {
                for (let k = 0; k < areaButtons.length; k++) {
                    if (j !== k) {
                        areaButtons[k].classList.remove("bg-emerald-600", "text-white", "hover:bg-emerald-700");
                        areaButtons[k].classList.add("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
                    }
                }
                areaButtons[j].classList.remove("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
                areaButtons[j].classList.add("bg-emerald-600", "text-white", "hover:bg-emerald-700");
            });
        }
    }
    async function getAreas() {
        let response = await fetch(`${BASE_URL}/meals/areas`);
        let data = await response.json();
        areas = data.results;
        displayAreas();
    }
    getAreas();
    let mealsContainer = [];
    async function getMealsBySearchCategory(meal) {
        document
            .getElementById("loading-spinner-design-meal")
            .classList.remove("hidden");
        document.getElementById("empty-state-design-meal").classList.add("hidden");
        try {
            let response = await fetch(`${BASE_URL}/meals/search?q=${meal}&page=1&limit=25`);
            if (!response.ok) {
                throw new Error("error");
            }
            let data = await response.json();
            document
                .getElementById("loading-spinner-design-meal")
                .classList.add("hidden");
            mealsContainer = data.results;
            if (mealsContainer.length === 0) {
                document
                    .getElementById("empty-state-design-meal")
                    .classList.remove("hidden");
            }
            recipesCount.innerHTML = `Showing ${mealsContainer.length} recipes for ${meal}`;
            displayMeals();
        }
        catch (error) {
            console.log("error", error);
            document
                .getElementById("loading-spinner-design-meal")
                .classList.add("hidden");
            document
                .getElementById("empty-state-design-meal")
                .classList.remove("hidden");
        }
    }
    let style = "grid";
    listViewBtn?.addEventListener("click", function () {
        document
            .getElementById("recipes-grid")
            ?.classList.add("grid-cols-2", "gap-4");
        document
            .getElementById("recipes-grid")
            ?.classList.remove("grid-cols-4", "gap-5");
        gridViewBtn?.classList.remove("bg-white", "rounded-md", "shadow-sm");
        listViewBtn?.classList.add("bg-white", "rounded-md", "shadow-sm");
        style = "list";
        displayMeals();
    });
    gridViewBtn?.addEventListener("click", function () {
        document
            .getElementById("recipes-grid")
            ?.classList.add("grid-cols-4", "gap-5");
        document
            .getElementById("recipes-grid")
            ?.classList.remove("grid-cols-2", "gap-4");
        listViewBtn?.classList.remove("bg-white", "rounded-md", "shadow-sm");
        gridViewBtn?.classList.add("bg-white", "rounded-md", "shadow-sm");
        style = "grid";
        displayMeals();
    });
    function displayMeals() {
        let container = "";
        for (let i = 0; i < mealsContainer.length; i++) {
            container += `
        <div
              class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group ${style === "grid" ? `` : `flex flex-row h-40`}"
              data-meal-id="${mealsContainer[i].id}"
            >
              <div class="relative overflow-hidden ${style === "grid" ? `h-48` : `w-48 h-full shrink-0`}">
                <img
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="${mealsContainer[i].thumbnail}"
                  alt="${mealsContainer[i].name}"
                  loading="lazy"
                />
                <div class="absolute bottom-3 left-3 flex gap-2 ${style === "grid" ? `` : `hidden`}">
                  <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-lg">
                            <i class="fas fa-tag mr-1 text-emerald-600"></i>${mealsContainer[i].category}
                  </span>
                  <span
                    class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-lg"
                  >
                    <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                    ${mealsContainer[i].area == null ? "International" : mealsContainer[i].area}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3
                  class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
                >
                  ${mealsContainer[i].name}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                ${mealsContainer[i].instructions.slice(0, 2).join(" ")}
                </p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900">
                    <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                    ${mealsContainer[i].category}
                  </span>
                  <span class="font-semibold text-gray-500">
                    <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                    ${mealsContainer[i].area == null ? "International" : mealsContainer[i].area}
                  </span>
                </div>
              </div>
            </div>
      `;
        }
        document.getElementById("recipes-grid").innerHTML = container;
    }
    getMealsBySearchCategory("chicken");
    async function getFilterMeal(category = "", area = "", ingredient = "") {
        document
            .getElementById("loading-spinner-design-meal")
            .classList.remove("hidden");
        document.getElementById("empty-state-design-meal").classList.add("hidden");
        try {
            let response = await fetch(`${BASE_URL}/meals/filter?category=${category}&area=${area}&ingredient=${ingredient}&page=1&limit=25`);
            if (!response.ok) {
                throw new Error("error");
            }
            document
                .getElementById("loading-spinner-design-meal")
                .classList.add("hidden");
            let data = await response.json();
            mealsContainer = data.results;
            if (mealsContainer.length === 0) {
                document
                    .getElementById("empty-state-design-meal")
                    .classList.remove("hidden");
            }
            recipesCount.innerHTML = `Showing ${mealsContainer.length} recipes for ${category || area || ingredient}`;
            displayMeals();
        }
        catch (error) {
            console.log("error", error);
            document
                .getElementById("loading-spinner-design-meal")
                .classList.add("hidden");
            document
                .getElementById("empty-state-design-meal")
                .classList.remove("hidden");
        }
    }
    document
        .getElementById("categories-grid")
        ?.addEventListener("click", function (event) {
        let target = event.target;
        let categoryCard = target.closest(".category-card");
        if (categoryCard) {
            let category = categoryCard.getAttribute("data-category");
            if (category) {
                getFilterMeal(category);
            }
        }
    });
    document
        .querySelector("#search-filters-section .flex.items-center")
        ?.addEventListener("click", function (event) {
        let target = event.target;
        let areaBtn = target.closest(".area-btn");
        if (areaBtn) {
            let area = areaBtn.textContent.trim();
            if (area === "all recipes" || area === "All Recipes") {
                getMealsBySearchCategory("chicken");
            }
            else {
                getFilterMeal("", area);
            }
        }
    });
    inputSearch?.addEventListener("input", function () {
        inputSearch.value = inputSearch.value.trim();
        if (inputSearch.value !== "") {
            getMealsBySearchCategory(inputSearch.value);
        }
    });
    let mealDetails;
    let nutrainsArray;
    async function getMealDetails(mealId) {
        try {
            let response = await fetch(`${BASE_URL}/meals/${mealId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch meal details");
            }
            let data = await response.json();
            mealDetails = data.result;
            let ingredients = [];
            let mealName = mealDetails.name;
            for (let i = 0; i < mealDetails.ingredients.length; i++) {
                ingredients.push(mealDetails.ingredients[i].measure +
                    " " +
                    mealDetails.ingredients[i].ingredient);
            }
            displayMealDetails();
            nutrainsArray = await postRecipe(mealName, ingredients);
            displayLogForm();
            displayNutritionFacts();
        }
        catch (error) {
            console.error(error);
            document.getElementById("nutrition-facts-container").innerHTML = `
      <p class="text-red-500 text-center">
        Failed to calculate nutrition. Please try again.
      </p>
    `;
            document
                .getElementById("log-meal-btn-loading")
                .classList.remove("hidden");
            document.getElementById("log-meal-btn-loading").innerHTML = "Faild api";
            document.getElementById("log-meal-btn").classList.add("hidden");
        }
    }
    let currentPath = window.location.hash.slice(1);
    if (currentPath.startsWith("/meal/")) {
        let mealId = currentPath.split("/")[2];
        if (mealId) {
            getMealDetails(mealId);
        }
    }
    let nutrains;
    function displayNutritionLoading() {
        document.getElementById("nutrition-facts-container").innerHTML = `
    <div class="flex justify-center items-center flex-col mt-6">
      <span class="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
        <i class="fa-solid fa-calculator text-lg text-emerald-600"></i>
      </span>

      <h3 class="text-lg font-medium text-gray-600 mb-1">
        Calculating Nutrition
      </h3>

      <p class="text-gray-400 text-sm mb-4">
        Analyzing ingredients...
      </p>

      <div class="flex items-center gap-1">
        <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
        <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
        <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
      </div>
    </div>
  `;
        document.getElementById("hero-calories").innerHTML = `Calculating...`;
        logMealBtn?.classList.add("hidden");
        logMealLoadingBtn?.classList.remove("hidden");
    }
    async function postRecipe(mealName, ingredients) {
        displayNutritionLoading();
        try {
            let response = await fetch(`${BASE_URL}/nutrition/analyze`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": `K77kkk7gmzpBdBzzF8gR7TqWnCppddnngbN8rP7L`,
                },
                body: JSON.stringify({
                    title: mealName,
                    ingredients: ingredients,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to analyze nutrition");
            }
            let data = await response.json();
            if (!data.data) {
                throw new Error("Nutrition data is not available");
            }
            nutrains = data.data;
            return nutrains;
        }
        catch (error) {
            console.error("Nutrition Error:", error);
            throw error;
        }
        finally {
            logMealBtn?.classList.remove("hidden");
            logMealLoadingBtn?.classList.add("hidden");
        }
    }
    function displayNutritionFacts() {
        document.getElementById("hero-servings").innerHTML =
            `${nutrainsArray.servings} servings`;
        document.getElementById("hero-calories").innerHTML =
            `${nutrainsArray.perServing.calories} cal/serving`;
        const dailyValues = {
            calories: 2000,
            protein: 50,
            fat: 78,
            carbs: 275,
            fiber: 28,
            sugar: 50,
            saturatedFat: 20,
            cholesterol: 300,
            sodium: 2300,
        };
        let proteinPercentage = (nutrainsArray.perServing.protein / dailyValues.protein) * 100;
        let carbsPercentage = (nutrainsArray.perServing.carbs / dailyValues.carbs) * 100;
        let fatPercentage = (nutrainsArray.perServing.fat / dailyValues.fat) * 100;
        let sugarPercentage = (nutrainsArray.perServing.sugar / dailyValues.sugar) * 100;
        let fiberPercentage = (nutrainsArray.perServing.fiber / dailyValues.fiber) * 100;
        let saturatedFatPercentage = (nutrainsArray.perServing.saturatedFat / dailyValues.saturatedFat) * 100;
        let container = `
    <p class="text-sm text-gray-500 mb-4">Per serving</p>
    <div
                    class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl"
                  >
                    <p class="text-sm text-gray-600">Calories per serving</p>
                    <p class="text-4xl font-bold text-emerald-600">${nutrainsArray?.perServing.calories}</p>
                    <p class="text-xs text-gray-500 mt-1">Total: ${nutrainsArray?.totals.calories} cal</p>
                  </div>

                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span class="text-gray-700">Protein</span>
                      </div>
                      <span class="font-bold text-gray-900">${nutrainsArray.perServing.protein}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-emerald-500 h-2 rounded-full"
                        style="width: ${proteinPercentage > 100 ? 100 : proteinPercentage}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="text-gray-700">Carbs</span>
                      </div>
                      <span class="font-bold text-gray-900">${nutrainsArray.perServing.carbs}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-blue-500 h-2 rounded-full"
                        style="width: ${carbsPercentage > 100 ? 100 : carbsPercentage}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span class="text-gray-700">Fat</span>
                      </div>
                      <span class="font-bold text-gray-900">${nutrainsArray.perServing.fat}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-purple-500 h-2 rounded-full"
                        style="width: ${fatPercentage > 100 ? 100 : fatPercentage}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span class="text-gray-700">Fiber</span>
                      </div>
                      <span class="font-bold text-gray-900">${nutrainsArray.perServing.fiber}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-orange-500 h-2 rounded-full"
                        style="width: ${fiberPercentage > 100 ? 100 : fiberPercentage}%"
                      ></div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span class="text-gray-700">Sugar</span>
                      </div>
                      <span class="font-bold text-gray-900">${nutrainsArray.perServing.sugar}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-pink-500 h-2 rounded-full"
                        style="width: ${sugarPercentage > 100 ? 100 : sugarPercentage}%"
                      ></div>
                    </div>

                    ${nutrainsArray.perServing.saturatedFat > 0
            ? `
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-red-500"></div>
                        <span class="text-gray-700">Saturated Fat</span>
                      </div>
                      <span class="font-bold text-gray-900">${nutrainsArray.perServing.saturatedFat}g</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div
                        class="bg-red-500 h-2 rounded-full"
                        style="width: ${saturatedFatPercentage > 100 ? 100 : saturatedFatPercentage}%"
                      ></div>
                    </div>`
            : ``}

                  <div class="mt-6 pt-6 border-t border-gray-100">
                    <h3 class="text-sm font-semibold text-gray-900 mb-3">
                      Other
                    </h3>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Cholesterol</span>
                        <span class="font-medium">${nutrainsArray.perServing.cholesterol}mg</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Sodium</span>
                        <span class="font-medium">${nutrainsArray.perServing.sodium}mg</span>
                      </div>
                    </div>
                  </div>
    `;
        document.getElementById("nutrition-facts-container").innerHTML = container;
    }
    function displayMealDetails() {
        if (!mealDetails)
            return;
        let ingredientsContainer = " ";
        let instructionsContainer = " ";
        let tags = " ";
        let youtubeLink = document.querySelector(".aspect-video iframe");
        let videoSection = document.querySelector(".video-section");
        logMealBtn.setAttribute("data-meal-id", mealDetails.id);
        mealDetilsImg?.setAttribute("src", mealDetails.thumbnail);
        mealDetilsImg?.setAttribute("alt", mealDetails.name);
        document.querySelector("#meal-details .absolute .tags span.bg-emerald-500").innerHTML = mealDetails.category;
        if (mealDetails.area) {
            document.querySelector("#meal-details .absolute .tags span.bg-blue-500").innerHTML = mealDetails.area;
            document
                .querySelector("#meal-details .absolute .tags span.bg-blue-500")
                .classList.remove("hidden");
        }
        else {
            document
                .querySelector("#meal-details .absolute .tags span.bg-blue-500")
                .classList.add("hidden");
        }
        document.querySelector("#meal-details .meal-title").innerHTML =
            mealDetails.name;
        document.querySelector(".num-of-items").innerHTML =
            `${mealDetails.ingredients.length} items`;
        if (mealDetails.youtube) {
            let videoId = new URL(mealDetails.youtube).searchParams.get("v");
            youtubeLink.src = `https://www.youtube.com/embed/${videoId}`;
            videoSection.style.display = "";
        }
        else {
            youtubeLink.src = "";
            videoSection.style.display = "none";
        }
        for (let i = 0; i < mealDetails.tags.length; i++) {
            tags += `
      <span class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">
        ${mealDetails.tags[i]}
      </span>
      `;
        }
        document.querySelector("#meal-details .absolute .meal-tags").innerHTML =
            tags;
        for (let i = 0; i < mealDetails.ingredients.length; i++) {
            ingredientsContainer += `
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
          <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"/>
            <span class="text-gray-700">
              <span class="font-medium text-gray-900">${mealDetails.ingredients[i].measure}</span> 
                ${mealDetails.ingredients[i].ingredient}
              </span>
            </div>`;
        }
        document.querySelector(".ingredints").innerHTML = ingredientsContainer;
        for (let i = 0; i < mealDetails.instructions.length; i++) {
            instructionsContainer += `
        <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
          <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
            ${i + 1}
          </div>
          <p class="text-gray-700 leading-relaxed pt-2">
            ${mealDetails.instructions[i]}
          </p>
        </div>`;
        }
        document.querySelector(".instructions").innerHTML = instructionsContainer;
    }
    document
        .getElementById("recipes-grid")
        ?.addEventListener("click", function (event) {
        let target = event.target;
        let recipeCard = target.closest(".recipe-card");
        if (recipeCard) {
            let mealId = recipeCard.getAttribute("data-meal-id");
            if (mealId) {
                window.location.hash = `#/meal/${mealId}`;
                getMealDetails(mealId);
            }
        }
    });
    backToMealsBtn?.addEventListener("click", function () {
        window.location.hash = "#/home";
    });
    // Product Scanner
    let categoryStyles = {
        Snacks: {
            primaryColor: "purple",
            secondColor: "pink",
            icon: "fa-cookie-bite",
        },
        Beverages: {
            primaryColor: "blue",
            secondColor: "cyan",
            icon: "fa-bottle-water",
        },
        Dairy: {
            primaryColor: "sky",
            secondColor: "blue",
            icon: "fa-cow",
        },
        Cheeses: {
            primaryColor: "yellow",
            secondColor: "amber",
            icon: "fa-cheese",
        },
        Yogurts: {
            primaryColor: "green",
            secondColor: "emerald",
            icon: "fa-bowl-food",
        },
        Chocolate: {
            primaryColor: "amber",
            secondColor: "orange",
            icon: "fa-candy-bar",
        },
        "Biscuits & Cookies": {
            primaryColor: "rose",
            secondColor: "pink",
            icon: "fa-cookie",
        },
        "Ice Cream": {
            primaryColor: "cyan",
            secondColor: "sky",
            icon: "fa-ice-cream",
        },
        "Breakfast Cereals": {
            primaryColor: "amber",
            secondColor: "orange",
            icon: "fa-wheat-awn",
        },
        Breads: {
            primaryColor: "orange",
            secondColor: "amber",
            icon: "fa-bread-slice",
        },
    };
    let categoryProduct = [];
    async function getProductCategory() {
        let response = await fetch(`${BASE_URL}/products/categories?limit=10`);
        let data = await response.json();
        categoryProduct = data.results;
        displayProductCategory();
    }
    function displayProductCategory() {
        let container = "";
        for (let i = 0; i < categoryProduct.length; i++) {
            let style = categoryStyles[categoryProduct[i].name] || {
                primaryColor: "cyan",
                secondColor: "blue",
                icon: "fa-cookie",
            };
            container += `
       <button
                class="product-category-btn flex-shrink-0 px-5 py-3 bg-gradient-to-r from-${style.primaryColor}-400 to-${style.secondColor}-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              data-category="${categoryProduct[i].id}">
                <i class="fa-solid ${style.icon} mr-1.5"></i>${categoryProduct[i].name}
      </button>
      `;
        }
        productCategories.innerHTML = container;
    }
    getProductCategory();
    let productsContainer = [];
    let productDetails;
    async function getProductByCategory(categoryName) {
        document.getElementById("empty-state-design").classList.add("hidden");
        document
            .getElementById("loading-spinner-design")
            .classList.remove("hidden");
        try {
            let response = await fetch(`${BASE_URL}/products/search?q=${categoryName}&page=1&limit=24`);
            if (!response.ok) {
                throw new Error("error");
            }
            document.getElementById("empty-state-design").classList.add("hidden");
            document
                .getElementById("loading-spinner-design")
                .classList.add("hidden");
            let data = await response.json();
            productsContainer = data.results;
            currentProductName = categoryName;
            if (productsContainer) {
                productsCount.innerHTML = `Found ${productsContainer.length} products for: ${categoryName}`;
            }
            displayProductByCategorySearch(grade, categoryName);
        }
        catch (error) {
            document.getElementById("empty-state-design").classList.remove("hidden");
            document
                .getElementById("loading-spinner-design")
                .classList.add("hidden");
            document.getElementById("products-grid").innerHTML = "";
            document.getElementById("products-count").innerHTML =
                "Not Found Products";
        }
    }
    productCategories?.addEventListener("click", function (event) {
        let target = event.target;
        let productCategoryBtn = target.closest(".product-category-btn");
        if (productCategoryBtn) {
            let categoryName = productCategoryBtn.getAttribute("data-category");
            getProductByCategory(categoryName);
        }
    });
    let grade = "";
    for (let i = 0; i < nutriScoreFilter.length; i++) {
        nutriScoreFilter[i].addEventListener("click", function () {
            grade =
                nutriScoreFilter[i]
                    .getAttribute("data-grade")
                    ?.toLowerCase() || "";
            displayProductByCategorySearch(grade, currentProductName);
        });
    }
    async function getProductBySearch(productName) {
        try {
            let response = await fetch(`${BASE_URL}/products/search?q=${productName}&page=1&limit=24`);
            if (!response.ok) {
                throw new Error("error");
            }
            document.getElementById("empty-state-design").classList.add("hidden");
            document
                .getElementById("loading-spinner-design")
                .classList.add("hidden");
            let data = await response.json();
            productsContainer = data.results;
            currentProductName = productName;
            displayProductByCategorySearch(grade, productName);
        }
        catch (error) {
            document.getElementById("empty-state-design").classList.remove("hidden");
            document
                .getElementById("loading-spinner-design")
                .classList.add("hidden");
            document.getElementById("products-grid").innerHTML = "";
            document.getElementById("products-count").innerHTML =
                "Not Found Products";
        }
    }
    searchProductBtn?.addEventListener("click", function () {
        document.getElementById("empty-state-design").classList.add("hidden");
        document
            .getElementById("loading-spinner-design")
            .classList.remove("hidden");
        if (productSearchInput) {
            getProductBySearch(productSearchInput.value.trim().toLowerCase());
        }
    });
    async function getProductByBarcode(barcode) {
        try {
            let response = await fetch(`${BASE_URL}/products/barcode/${barcode}`);
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            document.getElementById("empty-state-design").classList.add("hidden");
            document
                .getElementById("loading-spinner-design")
                .classList.add("hidden");
            let data = await response.json();
            productDetails = data.result;
            displayProductBybarcode();
            displayProductByBarcodeForm();
        }
        catch (error) {
            document.getElementById("empty-state-design").classList.remove("hidden");
            document
                .getElementById("loading-spinner-design")
                .classList.add("hidden");
            document.getElementById("products-grid").innerHTML = "";
            document.getElementById("products-count").innerHTML =
                "Not Found Products";
        }
    }
    document.getElementById("empty-state-design").classList.remove("hidden");
    document.getElementById("loading-spinner-design").classList.add("hidden");
    document.getElementById("products-grid").innerHTML = "";
    document.getElementById("products-count").innerHTML =
        "Search for products to see results";
    lookupBarcodeBtn?.addEventListener("click", function () {
        document.getElementById("empty-state-design").classList.add("hidden");
        document
            .getElementById("loading-spinner-design")
            .classList.remove("hidden");
        document.getElementById("products-grid").innerHTML = "";
        if (barcodeInput) {
            getProductByBarcode(barcodeInput.value.trim().toLowerCase());
        }
    });
    let nutritionColors = {
        a: "bg-green-500",
        b: "bg-lime-500",
        c: "bg-yellow-500",
        d: "bg-orange-500",
        e: "bg-red-500",
    };
    let novaGroupColors = {
        "1": "bg-green-500",
        "2": "bg-lime-500",
        "3": "bg-orange-500",
        "4": "bg-red-500",
    };
    let currentProductName = "";
    function displayProductByCategorySearch(grade, productName) {
        let filteredProducts = grade
            ? productsContainer.filter((product) => product.nutritionGrade?.toLowerCase() === grade.toLowerCase())
            : productsContainer;
        let container = "";
        let count = 0;
        if (filteredProducts.length > 0) {
            document.getElementById("empty-state-design").classList.add("hidden");
            for (let i = 0; i < filteredProducts.length; i++) {
                let gradeColor = nutritionColors[filteredProducts[i].nutritionGrade] || "bg-gray-400";
                let groupColor = novaGroupColors[filteredProducts[i].novaGroup] || "bg-gray-400";
                if (filteredProducts[i].nutrients.calories.toFixed(0) !== "0") {
                    count++;
                    container += `
      <div
                class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                data-barcode="${filteredProducts[i].barcode}"
              >
                <div
                  class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden"
                >
                  ${filteredProducts[i].image
                        ? `<img
                    class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    src="${filteredProducts[i].image}"
                    alt="${filteredProducts[i].name}"
                    loading="lazy"
                  />`
                        : `<div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden"><div class="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center"><i class="fa-solid fa-box text-2xl text-gray-400" ></i></div></div>`}

                  <!-- Nutri-Score Badge -->
                  <div
                    class="absolute top-2 left-2 ${gradeColor} text-white text-xs font-bold px-2 py-1 rounded uppercase"
                  >
                    Nutri-Score ${filteredProducts[i].nutritionGrade}
                  </div>

                  <!-- NOVA Badge -->
                  ${filteredProducts[i].novaGroup
                        ? `<div
                    class="absolute top-2 right-2 ${groupColor} text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    title="NOVA ${filteredProducts[i].novaGroup}"
                  >
                     ${filteredProducts[i].novaGroup}
                  </div>`
                        : ``}
                </div> 

                <div class="p-4">
                  <p
                    class="text-xs text-emerald-600 font-semibold mb-1 truncate"
                  >
                    ${filteredProducts[i].brand}
                  </p>
                  <h3
                    class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors"
                  >
                    ${filteredProducts[i].name}
                  </h3>

                  <div
                    class="flex items-center gap-3 text-xs text-gray-500 mb-3"
                  >
                    
                    <span
                      ><i class="fa-solid fa-fire mr-1"></i>${filteredProducts[i].nutrients.calories.toFixed(1)} kcal/100g</span
                    >
                  </div>

                  <!-- Mini Nutrition -->
                  <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                      <p class="text-xs font-bold text-emerald-700">${filteredProducts[i].nutrients.protein.toFixed(1)}g</p>
                      <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                      <p class="text-xs font-bold text-blue-700">${filteredProducts[i].nutrients.carbs.toFixed(1)}g</p>
                      <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                      <p class="text-xs font-bold text-purple-700">${filteredProducts[i].nutrients.fat.toFixed(1)}g</p>
                      <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                      <p class="text-xs font-bold text-orange-700">${filteredProducts[i].nutrients.sugar.toFixed(1)}g</p>
                      <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                  </div>
                </div>
              </div>
      `;
                }
            }
            productsCount.innerHTML = `Found ${count} products for: ${productName}`;
            document.getElementById("products-grid").innerHTML = container;
        }
        else {
            document.getElementById("products-grid").innerHTML = "";
            document.getElementById("empty-state-design").classList.remove("hidden");
        }
    }
    function displayProductBybarcode() {
        productsCount.innerHTML = `Found product: ${productDetails.name}`;
        let gradeColor = nutritionColors[productDetails.nutritionGrade] || "bg-gray-400";
        let groupColor = novaGroupColors[productDetails.novaGroup] || "bg-gray-400";
        if (productDetails.nutrients.calories.toFixed(0) !== "0") {
            let container = `
      <div
                class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                data-barcode="${productDetails.barcode}"
              >
                <div
                  class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden"
                >
                  ${productDetails.image
                ? `<img
                    class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    src="${productDetails.image}"
                    alt="${productDetails.name}"
                    loading="lazy"
                  />`
                : `<div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden"><div class="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center"><i class="fa-solid fa-box text-2xl text-gray-400" ></i></div></div>`}

                  <!-- Nutri-Score Badge -->
                  <div
                    class="absolute top-2 left-2 ${gradeColor} text-white text-xs font-bold px-2 py-1 rounded uppercase"
                  >
                    Nutri-Score ${productDetails.nutritionGrade}
                  </div>

                  <!-- NOVA Badge -->
                  ${productDetails.novaGroup
                ? `<div
                    class="absolute top-2 right-2 ${groupColor} text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    title="NOVA ${productDetails.novaGroup}"
                  >
                     ${productDetails.novaGroup}
                  </div>`
                : ``}
                </div> 

                <div class="p-4">
                  <p
                    class="text-xs text-emerald-600 font-semibold mb-1 truncate"
                  >
                    ${productDetails.brand}
                  </p>
                  <h3
                    class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors"
                  >
                    ${productDetails.name}
                  </h3>

                  <div
                    class="flex items-center gap-3 text-xs text-gray-500 mb-3"
                  >
                    
                    <span
                      ><i class="fa-solid fa-fire mr-1"></i>${productDetails.nutrients.calories.toFixed(1)} kcal/100g</span
                    >
                  </div>

                  <!-- Mini Nutrition -->
                  <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                      <p class="text-xs font-bold text-emerald-700">${productDetails.nutrients.protein.toFixed(1)}g</p>
                      <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                      <p class="text-xs font-bold text-blue-700">${productDetails.nutrients.carbs.toFixed(1)}g</p>
                      <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                      <p class="text-xs font-bold text-purple-700">${productDetails.nutrients.fat.toFixed(1)}g</p>
                      <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                      <p class="text-xs font-bold text-orange-700">${productDetails.nutrients.sugar.toFixed(1)}g</p>
                      <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                  </div>
                </div>
              </div>
      `;
            document.getElementById("products-grid").innerHTML = container;
        }
    }
    document
        .getElementById("products-grid")
        .addEventListener("click", function (event) {
        let target = event.target;
        let product = target.closest(".product-card");
        if (product) {
            document
                .getElementById("product-detail-modal")
                .classList.remove("hidden");
            getProductByBarcodeForm(product.getAttribute("data-barcode"));
        }
    });
    document
        .querySelector(".close-product-modal")
        ?.addEventListener("click", function () {
        document.getElementById("product-detail-modal").classList.add("hidden");
    });
    document
        .querySelector(".cancel-product-modal")
        ?.addEventListener("click", function () {
        document.getElementById("product-detail-modal").classList.add("hidden");
    });
    async function getProductByBarcodeForm(barcode) {
        let response = await fetch(`${BASE_URL}/products/barcode/${barcode}`);
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        let data = await response.json();
        productDetails = data.result;
        displayProductByBarcodeForm();
    }
    function displayProductByBarcodeForm() {
        let gradeColor = nutritionColors[productDetails.nutritionGrade] || "bg-gray-400";
        let groupColor = novaGroupColors[productDetails.novaGroup] || "bg-gray-400";
        let groupProcess = "";
        let novaProcess = "";
        let proteinPercentage = (productDetails.nutrients.protein / 50) * 100;
        let carbsPercentage = (productDetails.nutrients.carbs / 275) * 100;
        let fatPercentage = (productDetails.nutrients.fat / 78) * 100;
        let sugarPercentage = (productDetails.nutrients.sugar / 50) * 100;
        if (productDetails.nutritionGrade == "c")
            groupProcess = `Average`;
        else if (productDetails.nutritionGrade == "e")
            groupProcess = `Bad`;
        else if (productDetails.nutritionGrade == "b")
            groupProcess = `Good`;
        else if (productDetails.nutritionGrade == "a")
            groupProcess = `Excellent`;
        else if (productDetails.nutritionGrade == "unknown")
            groupProcess = `unknown`;
        if (productDetails.novaGroup == 1)
            novaProcess = `Unprocessed`;
        else if (productDetails.novaGroup == 2)
            novaProcess = `semi-processed`;
        else if (productDetails.novaGroup == 3)
            novaProcess = `Processed`;
        else if (productDetails.novaGroup == 4)
            novaProcess = `Ultra-processed`;
        if (productDetails.image) {
            document.getElementById("image-product-form").classList.remove("hidden");
            document.querySelector(".not-image").classList.add("hidden");
            document
                .getElementById("image-product-form")
                .setAttribute("src", productDetails.image);
            document
                .getElementById("image-product-form")
                .setAttribute("alt", productDetails.name);
        }
        else {
            document.getElementById("image-product-form").classList.add("hidden");
            document.querySelector(".not-image").classList.remove("hidden");
        }
        document.getElementById("product-category").innerHTML =
            productDetails.brand;
        document.getElementById("product-name").innerHTML = productDetails.name;
        document.querySelector(".grade-nova").innerHTML = `
    <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${productDetails.nutritionGrade == "unknown" ? `bg-white` : `#e63e1120`}">
                <span class="char-of-grade w-8 h-8 rounded flex items-center justify-center text-white font-bold ${gradeColor}">
                  ${productDetails.nutritionGrade == "unknown" ? "UK" : productDetails.nutritionGrade}
                </span>
                <div>
                  <p class="text-xs font-bold ${productDetails.nutritionGrade == "a" ? `text-green-500` : productDetails.nutritionGrade == "b" ? `text-lime-500` : productDetails.nutritionGrade == "c" ? `text-orange-500` : productDetails.nutritionGrade == "e" ? `text-red-500` : `text-gray-500`} ">Nutri-Score</p>
                  <p class="grade-process text-[10px] text-gray-600">${groupProcess}</p>
                </div>
              </div>

              ${productDetails.novaGroup
            ? `<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: #e63e1120">
                <span class="num-of-nova w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${groupColor}">
                  ${productDetails.novaGroup}
                </span>
                <div>
                  <p class="text-xs font-bold ${productDetails.novaGroup == 1 ? `text-green-500` : productDetails.novaGroup == 2 ? `text-lime-500` : productDetails.novaGroup == 3 ? `text-orange-500` : `text-red-500`}">NOVA</p>
                  <p class="nova-process text-[10px] text-gray-600">${novaProcess}</p>
                </div>
              </div>`
            : ``}

    `;
        document.querySelector(".calories.text-gray-900").innerHTML =
            productDetails.nutrients.calories.toFixed(1);
        document.querySelector(".nutrin-info").innerHTML = `
     <div class="text-center">
              <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div class="bg-emerald-500 h-2 rounded-full" style="width: ${proteinPercentage > 100 ? 100 : proteinPercentage}%"></div>
              </div>
              <p class="text-lg font-bold text-emerald-600">${productDetails.nutrients.protein.toFixed(1)}g</p>
              <p class="text-xs text-gray-500">Protein</p>
            </div>
            <div class="text-center">
              <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div class="bg-blue-500 h-2 rounded-full" style="width: ${carbsPercentage > 100 ? 100 : carbsPercentage}%"></div>
              </div>
              <p class="text-lg font-bold text-blue-600">${productDetails.nutrients.carbs.toFixed(1)}g</p>
              <p class="text-xs text-gray-500">Carbs</p>
            </div>
            <div class="text-center">
              <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div class="bg-purple-500 h-2 rounded-full" style="width:${fatPercentage > 100 ? 100 : fatPercentage}%"></div>
              </div>
              <p class="text-lg font-bold text-purple-600">${productDetails.nutrients.fat.toFixed(1)}g</p>
              <p class="text-xs text-gray-500">Fat</p>
            </div>
            <div class="text-center">
              <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div class="bg-orange-500 h-2 rounded-full" style="width: ${sugarPercentage > 100 ? 100 : sugarPercentage}%"></div>
              </div>
              <p class="text-lg font-bold text-orange-600">${productDetails.nutrients.sugar.toFixed(1)}g</p>
              <p class="text-xs text-gray-500">Sugar</p>
            </div>
    `;
    }
    logMealBtn?.addEventListener("click", function () {
        logMeal.classList.remove("hidden");
    });
    document
        .getElementById("cancel-log-meal")
        ?.addEventListener("click", function () {
        logMeal?.classList.add("hidden");
    });
    function displayLogForm() {
        document
            .querySelector(".meal-image-form")
            .setAttribute("src", mealDetails?.thumbnail);
        document
            .querySelector(".meal-image-form")
            .setAttribute("alt", mealDetails?.name);
        document.querySelector(".meal-name-form").innerHTML = mealDetails.name;
        document.querySelector(".calories.text-emerald-600").innerHTML =
            nutrainsArray.perServing.calories + "g";
        document.querySelector(".protien").innerHTML =
            nutrainsArray.perServing.protein + "g";
        document.querySelector(".fat").innerHTML =
            nutrainsArray.perServing.fat + "g";
        document.querySelector(".carbs").innerHTML =
            nutrainsArray.perServing.carbs + "g";
    }
    // Food Log
    let date = new Date();
    let TodayDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "2-digit",
    });
    document.getElementById("foodlog-date").innerHTML = TodayDate;
    let formattedDate = getFormattedDate(date);
    let foodlogStorage = JSON.parse(localStorage.getItem("meals") || "{}");
    let selectedDate = new Date();
    let weekDates = [];
    let daysNum = [];
    let daysName = [];
    for (let i = 6; i >= 0; i--) {
        let currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() - i);
        let currentFormattedDate = getFormattedDate(currentDate);
        let dayName = currentDate.toLocaleDateString("en-US", {
            weekday: "short",
        });
        let dayNum = currentDate.toLocaleDateString("en-US", {
            day: "2-digit",
        });
        daysNum.push(dayNum);
        daysName.push(dayName);
        weekDates.push(currentFormattedDate);
    }
    function displayWeeklyOverview() {
        let container = "";
        let items = 0;
        let totalCals = 0;
        let weeklyAvg = 0;
        for (let i = 0; i < weekDates.length; i++) {
            let logDate = weekDates[i];
            let isToday = logDate === getFormattedDate(new Date());
            container += `
      <div class="text-center ${isToday ? `bg-indigo-100 rounded-xl` : `bg-white rounded-xl`}">
        <p class="text-xs text-gray-500 mb-1">${daysName[i]}</p>
        <p class="text-sm font-medium text-gray-900">${daysNum[i]}</p>
        <div class="mt-2 text-gray-300">
          <p class="text-lg font-bold ${foodlogStorage[logDate] ? `text-emerald-600` : ``}">${foodlogStorage[logDate] ? `${foodlogStorage[logDate].totalCalories}` : `0`}</p>
          <p class="text-xs ${foodlogStorage[logDate] ? `text-emerald-600` : ``}">kcal</p>
          ${foodlogStorage[logDate] ? `<p class="text-xs text-gray-500">${foodlogStorage[logDate].meals.length} items</p>` : ``}
        </div>
      </div>
      `;
            totalCals += foodlogStorage[logDate]?.totalCalories || 0;
            items += foodlogStorage[logDate]?.meals?.length || 0;
        }
        weeklyAvg = totalCals / 7;
        document.querySelector(".weekly-items").innerHTML = `${items} items`;
        document.querySelector(".avg-cals").innerHTML =
            `${weeklyAvg.toFixed(1)} kcal`;
        document.getElementById("weekly-chart").innerHTML = container;
        let daysOnGoal = 0;
        for (let i = 0; i < weekDates.length; i++) {
            let logDate = weekDates[i];
            let dailyCalories = foodlogStorage[logDate]?.totalCalories || 0;
            if (dailyCalories >= 2000) {
                daysOnGoal++;
            }
        }
        document.querySelector(".days-on-goal").innerHTML =
            `${String(daysOnGoal)} / 7`;
    }
    displayWeeklyOverview();
    document
        .getElementById("confirm-log-meal")
        ?.addEventListener("click", function () {
        formattedDate = getFormattedDate(new Date());
        let loggedAt = new Date();
        let servingCount = Number(numberOfServing.value);
        if (!Number.isFinite(servingCount) || servingCount <= 0) {
            Swal.fire({
                title: "Invalid Servings",
                text: "Please enter a valid serving amount.",
                icon: "warning",
            });
            return;
        }
        let meals = JSON.parse(localStorage.getItem("meals") || "{}");
        if (!meals[formattedDate]) {
            meals[formattedDate] = {
                totalCalories: 0,
                totalProtein: 0,
                totalCarbs: 0,
                totalFat: 0,
                meals: [],
            };
        }
        let meal = {
            type: "recipe",
            name: mealDetails.name,
            mealId: mealDetails.id,
            category: mealDetails.category,
            thumbnail: mealDetails.thumbnail,
            servings: servingCount,
            loggedAt: loggedAt.toISOString(),
            nutrition: {
                calories: nutrainsArray.perServing.calories * Number(numberOfServing.value),
                protein: nutrainsArray.perServing.protein * Number(numberOfServing.value),
                carbs: nutrainsArray.perServing.carbs * Number(numberOfServing.value),
                fat: nutrainsArray.perServing.fat * Number(numberOfServing.value),
            },
        };
        meals[formattedDate].meals.push(meal);
        meals[formattedDate].totalCalories = Number((meals[formattedDate].totalCalories + meal.nutrition.calories).toFixed(1));
        meals[formattedDate].totalProtein = Number((meals[formattedDate].totalProtein + meal.nutrition.protein).toFixed(1));
        meals[formattedDate].totalCarbs = Number((meals[formattedDate].totalCarbs + meal.nutrition.carbs).toFixed(1));
        meals[formattedDate].totalFat = Number((meals[formattedDate].totalFat + meal.nutrition.fat).toFixed(1));
        localStorage.setItem("meals", JSON.stringify(meals));
        numberOfServing.value = "1";
        document.getElementById("log-meal-model")?.classList.add("hidden");
        Swal.fire({
            title: "Meal Logged!",
            html: `
        <p class="mb-4 text-gray-500">${mealDetails.name} (${servingCount} Serving) has been added to your daily log.</p>
        <span class="font-semibold text-green-700">++${meal.nutrition.calories} calories </span>
        `,
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
        });
        foodlogStorage = JSON.parse(localStorage.getItem("meals") || "{}");
        displayDailyFoodLog();
        displayWeeklyOverview();
    });
    increseServing?.addEventListener("click", function () {
        numberOfServing.value = String(Number(numberOfServing.value) + 0.5);
    });
    decreaseServing?.addEventListener("click", function () {
        if (Number(numberOfServing.value) > 0.5)
            numberOfServing.value = String(Number(numberOfServing.value) - 0.5);
    });
    if (foodlogStorage[formattedDate]?.meals?.length > 0) {
        displayDailyFoodLog();
    }
    else {
        displayEmptyDailyFoodLog();
    }
    function displayDailyFoodLog() {
        let container = "";
        if (foodlogStorage[formattedDate]?.meals?.length > 0 &&
            foodlogStorage[formattedDate]?.meals?.length) {
            document.getElementById("clear-foodlog").classList.remove("hidden");
            document.getElementById("num-of-logged-item").innerHTML =
                `Logged Items (${foodlogStorage[formattedDate].meals.length})`;
        }
        else {
            document.getElementById("clear-foodlog").classList.add("hidden");
            displayEmptyDailyFoodLog();
            return;
        }
        for (let i = 0; i < foodlogStorage[formattedDate].meals.length; i++) {
            let time = new Date(foodlogStorage[formattedDate].meals[i].loggedAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
            container += `
    <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
                <div class="flex items-center gap-4">
                ${foodlogStorage[formattedDate].meals[i].thumbnail
                ? `<img src="${foodlogStorage[formattedDate].meals[i].thumbnail}" alt="${foodlogStorage[formattedDate].meals[i].name}"
                    class="w-14 h-14 rounded-xl object-cover">`
                : `<div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <i class="text-blue-600 text-xl fa-solid fa-box"></i>
                                </div>`}
                  <div>
                    <p class="font-semibold text-gray-900">${foodlogStorage[formattedDate].meals[i].name}</p>
                    ${foodlogStorage[formattedDate].meals[i].servings
                ? `<p class="text-sm text-gray-500">
                      ${foodlogStorage[formattedDate].meals[i].servings} serving
                      <span class="mx-1">•</span>
                      <span class="text-emerald-600">${foodlogStorage[formattedDate].meals[i].type}</span>
                    </p>`
                : `<p class="text-sm text-gray-500">
                      ${foodlogStorage[formattedDate].meals[i].brand}
                      <span class="mx-1">•</span>
                      <span class="text-blue-600">${foodlogStorage[formattedDate].meals[i].type}</span>
                    </p>`}
                    <p class="text-xs text-gray-400 mt-1">${time}</p>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-right">
                    <p class="text-lg font-bold text-emerald-600">${foodlogStorage[formattedDate].meals[i].nutrition.calories}</p>
                    <p class="text-xs text-gray-500">kcal</p>
                  </div>
                  <div class=" md:flex hidden gap-2 text-xs text-gray-500">
                    <span class="px-2 py-1 bg-blue-50 rounded">${foodlogStorage[formattedDate].meals[i].nutrition.protein}g P</span>
                    <span class="px-2 py-1 bg-amber-50 rounded">${foodlogStorage[formattedDate].meals[i].nutrition.carbs}g C</span>
                    <span class="px-2 py-1 bg-purple-50 rounded">${foodlogStorage[formattedDate].meals[i].nutrition.fat}g F</span>
                  </div>
                  <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2"
                    data-index="${i}">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
    `;
        }
        let totalFats = foodlogStorage[formattedDate].totalFat;
        let totalCals = foodlogStorage[formattedDate].totalCalories;
        let totalProtein = foodlogStorage[formattedDate].totalProtein;
        let totalCarbs = foodlogStorage[formattedDate].totalCarbs;
        let process = "";
        let processBarData = [
            {
                name: "Fat",
                totalNum: totalFats,
                actualTotal: "65 g",
                color: "purple",
            },
            {
                name: "Calories",
                totalNum: totalCals,
                actualTotal: "2000 kcal",
                color: "emerald",
            },
            {
                name: "Protein",
                totalNum: totalProtein,
                actualTotal: "50 g",
                color: "blue",
            },
            {
                name: "Carbs",
                totalNum: totalCarbs,
                actualTotal: "250 g",
                color: "amber",
            },
        ];
        for (let i = 0; i < processBarData.length; i++) {
            let total = Number.parseFloat(String(processBarData[i].totalNum));
            let target = Number.parseFloat(String(processBarData[i].actualTotal));
            let percentage = target > 0 ? Math.round((total / target) * 100) : 0;
            process += ` 
            <div class="bg-${processBarData[i].color}-50 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-gray-700">${processBarData[i].name}</span>
                <span class="text-sm text-gray-500">${processBarData[i].totalNum} / ${processBarData[i].actualTotal}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="${percentage >= 100 ? `bg-red-500` : `bg-${processBarData[i].color}-500`} h-2.5 rounded-full"  style="width: ${percentage > 100 ? 100 : percentage}%"></div>
              </div>
            </div>`;
        }
        document.querySelector(".process-bars-foodlog").innerHTML = process;
        document.getElementById("logged-items-list").innerHTML = container;
    }
    function displayEmptyDailyFoodLog() {
        document.getElementById("clear-foodlog").classList.add("hidden");
        document.getElementById("num-of-logged-item").innerHTML =
            `Logged Items (0)`;
        let container = `
  <div class="text-center py-8 text-gray-500">
                <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
                <p class="font-medium">No meals logged today</p>
                <p class="text-sm">
                  Add meals from the Meals page or scan products
                </p>
              </div>
              <div class="flex justify-center gap-3">
                <a href="#/home"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">
                  <i class="fa-solid fa-plus"></i>
                  Browse Recipes
                </a>
                <a href="#/products"
                  class="nav-link inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                  <i class="fa-solid fa-barcode"></i>
                  Scan Product
                </a>
              </div>`;
        document.getElementById("logged-items-list").innerHTML = container;
        let processBarData = [
            {
                name: "Fat",
                totalNum: 0,
                actualTotal: "65 g",
                color: "purple",
            },
            {
                name: "Calories",
                totalNum: 0,
                actualTotal: "2000 kcal",
                color: "emerald",
            },
            {
                name: "Protein",
                totalNum: 0,
                actualTotal: "50 g",
                color: "blue",
            },
            {
                name: "Carbs",
                totalNum: 0,
                actualTotal: "250 g",
                color: "amber",
            },
        ];
        let process = "";
        for (let i = 0; i < processBarData.length; i++) {
            process += ` 
            <div class="bg-${processBarData[i].color}-50 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-gray-700">${processBarData[i].name}</span>
                <span class="text-sm text-gray-500">${processBarData[i].totalNum} / ${processBarData[i].actualTotal}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-gray-200 h-2.5 rounded-full"  style="width: 0%"></div>
              </div>
            </div>`;
        }
        document.querySelector(".process-bars-foodlog").innerHTML = process;
    }
    document
        .getElementById("clear-foodlog")
        ?.addEventListener("click", function () {
        Swal.fire({
            title: "Clear Today's Log?",
            text: "This will remove all logged food items for today.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, clear it!",
        }).then((result) => {
            if (result.isConfirmed) {
                formattedDate = getFormattedDate(new Date());
                let meals = JSON.parse(localStorage.getItem("meals") || "{}");
                delete meals[formattedDate];
                localStorage.setItem("meals", JSON.stringify(meals));
                foodlogStorage = meals;
                displayWeeklyOverview();
                displayEmptyDailyFoodLog();
                Swal.fire({
                    title: "Cleared!",
                    text: "Your food log has been cleared.",
                    icon: "success",
                    showConfirmButton: false,
                });
            }
        });
    });
    document
        .getElementById("logged-items-list")
        ?.addEventListener("click", function (event) {
        let target = event.target;
        let removeBtn = target.closest(".remove-foodlog-item");
        if (removeBtn) {
            formattedDate = getFormattedDate(new Date());
            let index = Number(removeBtn.getAttribute("data-index"));
            let meals = JSON.parse(localStorage.getItem("meals") || "{}");
            if (!meals[formattedDate]?.meals?.[index]) {
                return;
            }
            let removedMeal = meals[formattedDate].meals[index];
            meals[formattedDate].totalCalories = Number((meals[formattedDate].totalCalories - removedMeal.nutrition.calories).toFixed(1));
            meals[formattedDate].totalProtein = Number((meals[formattedDate].totalProtein - removedMeal.nutrition.protein).toFixed(1));
            meals[formattedDate].totalCarbs = Number((meals[formattedDate].totalCarbs - removedMeal.nutrition.carbs).toFixed(1));
            meals[formattedDate].totalFat = Number((meals[formattedDate].totalFat - removedMeal.nutrition.fat).toFixed(1));
            meals[formattedDate].meals.splice(index, 1);
            localStorage.setItem("meals", JSON.stringify(meals));
            foodlogStorage = meals;
            Swal.fire({
                position: "bottom-end",
                title: "Item removed from log.",
                width: "247px",
                customClass: {
                    popup: "custom-alert",
                },
                background: "#2563eb",
                color: "#ffffff",
                showConfirmButton: false,
                timer: 30000,
            });
            if (meals[formattedDate].meals.length > 0) {
                displayDailyFoodLog();
                displayWeeklyOverview();
            }
            else {
                displayEmptyDailyFoodLog();
                displayWeeklyOverview();
            }
        }
    });
    document
        .querySelector(".add-product-to-log")
        ?.addEventListener("click", function () {
        formattedDate = getFormattedDate(new Date());
        let loggedAt = new Date();
        let meals = JSON.parse(localStorage.getItem("meals") || "{}");
        if (!meals[formattedDate]) {
            meals[formattedDate] = {
                totalCalories: 0,
                totalProtein: 0,
                totalCarbs: 0,
                totalFat: 0,
                meals: [],
            };
        }
        let meal = {
            type: "product",
            name: productDetails.name,
            barcode: productDetails.barcode,
            brand: productDetails.brand,
            thumbnail: productDetails.image,
            loggedAt: loggedAt.toISOString(),
            nutrition: {
                calories: Number(productDetails.nutrients.calories.toFixed(1)),
                protein: Number(productDetails.nutrients.protein.toFixed(1)),
                carbs: Number(productDetails.nutrients.carbs.toFixed(1)),
                fat: Number(productDetails.nutrients.fat.toFixed(1)),
            },
        };
        meals[formattedDate].meals.push(meal);
        meals[formattedDate].totalCalories = Number((meals[formattedDate].totalCalories + meal.nutrition.calories).toFixed(1));
        meals[formattedDate].totalProtein = Number((meals[formattedDate].totalProtein + meal.nutrition.protein).toFixed(1));
        meals[formattedDate].totalCarbs = Number((meals[formattedDate].totalCarbs + meal.nutrition.carbs).toFixed(1));
        meals[formattedDate].totalFat = Number((meals[formattedDate].totalFat + meal.nutrition.fat).toFixed(1));
        localStorage.setItem("meals", JSON.stringify(meals));
        document.getElementById("product-detail-modal")?.classList.add("hidden");
        Swal.mixin({
            toast: true,
            position: "bottom-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: false,
            customClass: {
                popup: "custom-toast",
            },
        }).fire({
            title: `${meal.name} Original logged to your daily intake! 📝`,
        });
        foodlogStorage = JSON.parse(localStorage.getItem("meals") || "{}");
        displayDailyFoodLog();
        displayWeeklyOverview();
    });
})();
export {};
