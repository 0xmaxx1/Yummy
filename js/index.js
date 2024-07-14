/// <reference types="../@types/jquery" />
const rowContainer = $("#rowContainer");
const barIcon = $(".bar i.open-close-icon");
const aside = $("aside");
closeSide();
function endloading() {
  $(".fa-spinner").fadeOut(700, function () {
    $(".loading").fadeOut(400, function () {
      $("body").css("overflow", "auto");
    });
  });
}
function startloading() {
  $(".fa-spinner").fadeIn(0, function () {
    $(".loading").fadeIn(0);
  });
  $("body").css("overflow", "hidden");
}
$(".bar i.open-close-icon").on("click", function () {
  if ($("aside").css("left") == "0px") {
    closeSide();
  } else {
    openSide();
  }
});
function openSide() {
  const listItem = $(".side ul li").toArray();
  barIcon.removeClass("fa-align-justify");
  barIcon.addClass("fa-x");
  aside.animate({ left: 0 }, 500);
  listItem.map(function (item, index) {
    $(item).animate({ top: "0" }, (index + 6) * 90);
  });
}
function closeSide() {
  let widthSide = $(".side").outerWidth();
  barIcon.removeClass("fa-x");
  barIcon.addClass("fa-align-justify");
  aside.animate({ left: -widthSide }, 500);
  $(".side ul li").animate({ top: "260" }, 600);
}
(async function displayMeals() {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=`
  );
  const datares = await res.json();
  displayarrofcontent(datares.meals);
})();
async function displayAllCategory() {
  startloading();
  let cartona = "";
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  const dataResponse = await response.json();
  let arrcategory = dataResponse.categories;
  arrcategory.forEach((item) => {
    cartona += `
  <div class="col-md-4 col-sm-6 col-lg-3">
          <div class="innerbox rounded-2 overflow-hidden position-relative cursor-pointer" onclick="filterCategoryByName('${
            item.strCategory
          }')">
            <img src="${item.strCategoryThumb}" class="img-fluid" alt="" />
            <div class="slide-img text-black text-center p-2 position-absolute">
              <h3>${item.strCategory}</h3>
              <p>${item.strCategoryDescription
                .split(" ")
                .slice(0, 20)
                .join(" ")}</p>
            </div>
          </div>
        </div>
  `;
  });
  rowContainer.html(cartona);
  endloading();
}
$("#categoryYummy").on("click", function () {
  displayAllCategory();
  closeSide();
});
async function filterCategoryByName(nameofcategory) {
  startloading();
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${nameofcategory}`
  );
  const datares = await response.json();
  let sliceOfArr = datares.meals.slice(0, 20);
  displayarrofcontent(sliceOfArr);
}
async function displayDetails(id) {
  startloading();
  let cartona = "";
  let listcontent = "";
  let tagsContent = "";
  const respo = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const datarespo = await respo.json();
  for (let i = 1; i <= 20; i++) {
    if (datarespo.meals[0][`strIngredient${i}`]) {
      listcontent += `
    <li class="alert alert-info p-1 m-2"> ${
      datarespo.meals[0][`strMeasure${i}`]
    } ${datarespo.meals[0][`strIngredient${i}`]}</li>
    `;
    }
  }
  let tags = datarespo.meals[0].strTags?.split(",");
  if (tags == undefined) {
    tags = [];
  }
  tags.forEach((item) => {
    tagsContent += `
  <li class="alert alert-danger p-1">${item}</li>
  `;
  });
  cartona += `
    <div class="col-md-4">
              <div class="inner-left">
                <img src="${datarespo.meals[0].strMealThumb}" class="img-fluid rounded-3" alt="" />
                <h2 class="mt-1">${datarespo.meals[0].strMeal}</h2>
              </div>
            </div>
            <div class="col-md-8">
              <div class="inner-right">
                <h2>Instructions</h2>
                <p>${datarespo.meals[0].strInstructions}</p>
                <h3>Area : ${datarespo.meals[0].strArea}</h3>
                <h3>Category : ${datarespo.meals[0].strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex flex-wrap">
                    ${listcontent}
                </ul>
                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex gap-3">
                    ${tagsContent}
                </ul>
                <div class="sources">
                  <a class="btn btn-success mb-2" href="${datarespo.meals[0].strSource}" target="_blank">Source</a>
                  <a class="btn btn-danger mb-2" href="${datarespo.meals[0].strYoutube}" target="_blank">Youtube</a>
                </div>
              </div>
            </div>
    `;
  rowContainer.addClass("text-white");
  rowContainer.html(cartona);
  endloading();
}
$("#areaYummy").on("click", function () {
  displayAllArea();
  closeSide();
});
async function displayAllArea() {
  startloading();
  let cartona = "";
  const areaResponse = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  const areaData = await areaResponse.json();
  areaData.meals.forEach((item) => {
    cartona += `
                <div class="col-md-4 col-sm-6 col-lg-3">
            <div class="inner-area text-center cursor-pointer" onclick="displayOnlyArea('${item.strArea}')">
              <i class="fa-solid fa-house-laptop fa-4x"></i>
              <h3>${item.strArea}</h3>
            </div>
          </div>
    `;
  });
  rowContainer.html(cartona);
  endloading();
}
async function displayOnlyArea(NameOfArea) {
  startloading();
  const onlyAreaResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${NameOfArea}`
  );
  const onlyAreaData = await onlyAreaResponse.json();
  displayarrofcontent(onlyAreaData.meals.slice(0, 20));
}
function displayarrofcontent(arr) {
  startloading();
  let cartona = "";
  arr.forEach((item) => {
    cartona += `
    <div class="col-md-4 col-sm-6 col-lg-3">
    <div class="innerbox rounded-2 overflow-hidden position-relative cursor-pointer" onclick="displayDetails(${item.idMeal})">
      <img src="${item.strMealThumb}" class="img-fluid" alt="" />
      <div class="slide-img text-black d-flex align-items-center ps-2 position-absolute">
        <h3>${item.strMeal}</h3>
      </div>
    </div>
  </div>
`;
  });
  rowContainer.html(cartona);
  endloading();
}
$("#ingredYummy").on("click", function () {
  displayAllingred();
  closeSide();
});
async function displayAllingred() {
  startloading();
  let cartona = "";
  const allingred = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  const dataOnlyIngred = await allingred.json();
  dataOnlyIngred.meals.slice(0, 20).forEach((item) => {
    if (item.strDescription) {
      cartona += `
                <div class="col-md-4 col-sm-6 col-lg-3">
              <div class="inner-ingred text-center cursor-pointer" onclick="displayOnlyIngred('${
                item.strIngredient
              }')">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${item.strIngredient}</h3>
                <p>${item.strDescription.split(" ").slice(0, 20).join(" ")}</p>
              </div>
            </div>
      `;
    }
  });
  rowContainer.html(cartona);
  endloading();
}
async function displayOnlyIngred(nameOfIngred) {
  const responseOnlyIngrred = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${nameOfIngred}`
  );
  const dataResponseOnlyIngred = await responseOnlyIngrred.json();
  displayarrofcontent(dataResponseOnlyIngred.meals);
}
$("#searchYummy").on("click", function () {
  displaySearch();
  closeSide();
});
function displaySearch() {
  startloading();
  let cartona = `
            <div class=" col-sm-6">
            <div class="inner-search">
              <input type="text"  class="form-control bg-transparent text-white"  id="searchName" autocomplete="off" placeholder="Search By Name">
              <div class="invalid-feedback">
                  Please enter a valid name for your search
                  </div>
            </div>
          </div>
          <div class=" col-sm-6">
            <div class="inner-search">
              <input type="text" class="form-control  bg-transparent text-white" autocomplete="off" id="searchLetter" placeholder="Search By First Letter" >
                          <div class="invalid-feedback">
                  Please enter a valid letter for your search
                  </div>
              </div>
          </div>
          <div class="row py-2 g-4" id="boxContent"></div>
  `;
  rowContainer.html(cartona);
  endloading();
  $(function () {
    $("#searchName").on("keyup", function () {
      displayItemBySearch("name");
      $("#searchLetter").attr("disabled", true);
      if ($("#searchName").val().trim() === "") {
        $("#searchLetter").attr("disabled", false);
        // $("#searchName").removeClass("is-valid");
      }
    });
    $("#searchLetter").on("keyup", function () {
      displayItemBySearch("letter");
      $("#searchName").attr("disabled", true);
      if ($("#searchLetter").val().trim() === "") {
        $("#searchName").attr("disabled", false);
      }
    });
  });
  $("#searchLetter").on("focus", function () {
    $("#searchName").removeClass("is-invalid");
  });
  $("#searchName").on("focus", function () {
    $("#searchLetter").removeClass("is-invalid");
  });
}
async function displayItemBySearch(typeOfInput) {
  let regex, resSearch, searchValue, regexName, regexFirstLetter;
  regexName = /^[a-zA-Z\s]+$/;
  regexFirstLetter = /^[a-zA-Z]$/;
  if (typeOfInput == "name") {
    searchValue = $("#searchName").val().trim();
    regex = regexName;
    resSearch = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`;
  } else {
    searchValue = $("#searchLetter").val().trim();
    regex = regexFirstLetter;
    resSearch = `https://www.themealdb.com/api/json/v1/1/search.php?f=${searchValue}`;
  }
  if (regex.test(searchValue)) {
    try {
      const response = await fetch(resSearch);
      const dataResponse = await response.json();
      if (dataResponse.meals === null) {
        validationinputs(typeOfInput, false);
        displayResultOfsearch([]);
      } else {
        if (
          $("#searchName").val().trim() === "" &&
          $("#searchLetter").val().trim() === ""
        ) {
          validationinputs(typeOfInput, false);
        } else {
          displayResultOfsearch(dataResponse.meals);
          validationinputs(typeOfInput, true);
        }
      }
    } catch (err) {
      console.error("Error Fetch Data", err);
    }
  } else {
    displayResultOfsearch([]);
    validationinputs(typeOfInput, false);
  }
}
function validationinputs(type, isvalid) {
  const inputType = type === "name" ? $("#searchName") : $("#searchLetter");
  if (isvalid) {
    inputType.addClass("is-valid").removeClass("is-invalid");
  } else {
    inputType.addClass("is-invalid").removeClass("is-valid");
  }
}
function displayResultOfsearch(meals) {
  let cartona = "";
  meals.forEach((item) => {
    cartona += `
    <div class="col-md-4 col-sm-6 col-lg-3">
    <div class="innerbox rounded-2 overflow-hidden position-relative cursor-pointer" onclick="displayDetails(${item.idMeal})">
      <img src="${item.strMealThumb}" class="img-fluid" alt="" />
      <div class="slide-img text-black d-flex align-items-center ps-2 position-absolute">
        <h3>${item.strMeal}</h3>
      </div>
    </div>
  </div>
`;
  });
  $("#boxContent").html(cartona);
}
$("#contactYummy").on("click", function () {
  displayContact();
  closeSide();
});
function displayContact() {
  let cartona = `
    <div class="box-contact w-75 text-center">
      <div class="row py-3 g-4" id="rowContainer">
        <div class="col-sm-6">
          <div class="inner-contact">
            <input
              type="email"
              class="form-control"
              autocomplete="off"
              placeholder="Enter Your Name"
              id="contactName"
              required 
            />
            <p class="alert alert-danger w-100 mt-2 d-none" id="nameMsg">Please enter letters and spaces only, no numbers or special characters.</p>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="inner-contact">
            <input
              type="text"
              class="form-control"
              autocomplete="off"
              placeholder="Enter Your Email"
              id="contactEmail"
              required 
            />
            <p class="alert alert-danger mt-2 d-none w-100" id="emailMsg">Please enter a valid email address.</p>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="inner-contact">
            <input
              type="text"
              class="form-control"
              autocomplete="off"
              placeholder="Enter Your Phone"
              id="contactPhone"
              required 
            />
            <p class="alert alert-danger mt-2 d-none w-100" id="phoneMsg">Please enter a valid phone number.</p>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="inner-contact">
            <input
              type="number"
              class="form-control"
              autocomplete="off"
              placeholder="Enter Your Age"
              id="contactAge"
              required 
            />
            <p class="alert alert-danger mt-2 w-100 d-none" id="ageMsg">Please enter a valid age between 1 and 120</p>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="inner-contact">
            <input
              type="password"
              class="form-control"
              autocomplete="off"
              placeholder="Enter Your Password"
              id="contactPassword"
              required 
            />
            <p class="alert alert-danger w-100 d-none mt-2" id="passMsg">Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.</p>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="inner-contact">
            <input
              type="password"
              class="form-control"
              autocomplete="off"
              placeholder="Repassword"
              id="contactRePassword"
              required 
            />
            <p class="alert w-100 mt-2 d-none alert-danger" id="repassMsg">Please re-enter your password correctly.</p>
          </div>
        </div>
      </div>
      <button class="btn btn-outline-danger" disabled id="btnContact">Submit</button>
    </div>
  `;
  $("#dataContainer").html(cartona);
  $("#dataContainer").addClass(
    "d-flex justify-content-center align-items-center"
  );
  validateInputBreak();
}
function validateInputBreak() {
  document.querySelectorAll(".form-control").forEach((input) => {
    input.addEventListener("input", () => validateForm());
  });
}
function validateForm() {
  const contactName = document.getElementById("contactName");
  const contactEmail = document.getElementById("contactEmail");
  const contactPhone = document.getElementById("contactPhone");
  const contactAge = document.getElementById("contactAge");
  const contactPassword = document.getElementById("contactPassword");
  const contactRePassword = document.getElementById("contactRePassword");
  if (
    validationInputsContact(contactName, "nameMsg") &&
    validationInputsContact(contactEmail, "emailMsg") &&
    validationInputsContact(contactPhone, "phoneMsg") &&
    validationInputsContact(contactAge, "ageMsg") &&
    validationInputsContact(contactPassword, "passMsg") &&
    validationInputsContact(contactRePassword, "repassMsg")
  ) {
    document.getElementById("btnContact").removeAttribute("disabled");
  } else {
    document.getElementById("btnContact").setAttribute("disabled", true);
  }
}
function validationInputsContact(ele, msgId) {
  let msg = document.getElementById(msgId);
  let regexInputs = {
    contactName: /^[a-zA-Z\s]+$/,
    contactEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    contactPhone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    contactAge: /^(?:[1-9][0-9]?|1[01][0-9]|120)$/,
    contactPassword:
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
  };
  if (ele.id === "contactRePassword") {
    let pass = document.getElementById("contactPassword").value;
    if (ele.value !== pass) {
      ele.classList.add("is-invalid");
      ele.classList.remove("is-valid");
      msg.classList.remove("d-none");
      return false;
    } else {
      ele.classList.add("is-valid");
      ele.classList.remove("is-invalid");
      msg.classList.add("d-none");
      return true;
    }
  } else if (regexInputs[ele.id].test(ele.value)) {
    ele.classList.add("is-valid");
    ele.classList.remove("is-invalid");
    msg.classList.add("d-none");
    return true;
  } else {
    ele.classList.add("is-invalid");
    ele.classList.remove("is-valid");
    msg.classList.remove("d-none");
    return false;
  }
}
