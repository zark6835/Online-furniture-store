const wrapperCardList = document.querySelector(".main-card__list");
const basketlist = document.querySelector(".basket-list");

//menu
document.querySelector(".header-basket__wrapper").addEventListener("click",() => (document.querySelector(".basket-wrapper").style.right = "0px"));
document.querySelector(".basket-cross").addEventListener("click",() => (document.querySelector(".basket-wrapper").style.right = "-400px"));

//функція яка приймає JSON
async function list() {
  const res = await fetch("https://6403bd953bdc59fa8f2c07bd.mockapi.io/task");
  const data = await res.json();

  //міняє число над іконкою корзини кожен раз коли туди додається елемент
  document.querySelector(".header-items").textContent = basketlist.children.length;

  //бере з data тільки 6 обєктів і передає в функцію cardsElement
  const slicedItems = data.slice(0, 6);
  cardsElement(slicedItems);

  //функція яка приймає значення та рендерить картку
  function cardsElement(mas) {
    wrapperCardList.innerHTML = "";
    mas.forEach((element) => {
      let cards = `
              <li class="main-card__item" data-id="${element.id}">
                <img class="main-card__img" src="${element.img}" alt="" />
                <div>
                <p class="main-card__name basket-push">${element.name}</p>
                <p class="main-card__price" data-original-price="${element.price}">${element.price + "грн"}</p>
                </div>
              </li>
          `;
      wrapperCardList.insertAdjacentHTML("afterbegin", cards);
    });
    //міняє число над іконкою корзини кожен раз коли туди додається елемент
    document.querySelector(".header-items").textContent = basketlist.children.length;
  }

  // додає до корзини елементи по натисканю на назву продукту
  wrapperCardList.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("basket-push")) {
      const card = target.closest(".main-card__item");
      // додає класи для елемента в корзині
      card.classList.add("basket");
      card.querySelector(".main-card__img").classList.add("basket");
      card.querySelector("div").classList.add("basket-list__information");
      card.querySelector("div").insertAdjacentHTML("beforeend",'<p class="basket-list__del main-card__name">remove</p>');
      card.querySelector("div").querySelector(".basket-push").classList.add("basket");
      card.querySelector("div").querySelector(".main-card__price").classList.add("basket");
      card.insertAdjacentHTML("beforeend",
        `
          <div class="basket-list__number">
          <img class="basket-list__number__vector" src="./images/vector-uphill.png" alt="">
          <p class="basket-list__number__style">1</p>
          <img class="basket-list__number__vector__down" src="./images/vector-down.png" alt="">
          </div>
          `
      );
      basketlist.appendChild(card);

      priceCalculation()
      saveToLocalStorage();
      cardsElement(data);
    }
  });

  //добавляє та убавляє чисельність конкретно заказуємого товару
  basketlist.addEventListener("click", (item) => {
    const target = item.target;
    
    if (target.className == "basket-list__number__vector") {
      target.parentElement.querySelector(".basket-list__number__style").textContent = parseInt(target.parentElement.querySelector(".basket-list__number__style").textContent) + 1;
      let numberPlus = target.parentElement.querySelector(".basket-list__number__style").textContent;
      const price = parseInt(target.parentElement.parentElement.querySelector(".main-card__price").dataset.originalPrice);

      let mumnog = price * parseInt(numberPlus);
      target.parentElement.parentElement.querySelector(".main-card__price").textContent = mumnog + "грн";
      saveToLocalStorage();
    } else if (target.className == "basket-list__number__vector__down") {
      if (target.parentElement.querySelector(".basket-list__number__style").textContent != 1) {
        target.parentElement.querySelector(".basket-list__number__style").textContent =parseInt(target.parentElement.querySelector(".basket-list__number__style").textContent) - 1;
        let numberMinus = target.parentElement.parentElement.querySelector(".main-card__price").textContent;
        const price = parseInt(target.parentElement.parentElement.querySelector(".main-card__price").dataset.originalPrice);

        let minus = parseInt(numberMinus) - price;
        target.parentElement.parentElement.querySelector(".main-card__price").textContent = minus + "грн";
      }
      saveToLocalStorage();
    }
    //видаляє елемент з корзини
    if (target.className == "basket-list__del main-card__name") {
      target.parentElement.parentElement.remove();
      document.querySelector(".header-items").textContent = basketlist.children.length;

      saveToLocalStorage();
    }
    priceCalculation();
  });
  //підрахунок ціни в корзині
  function priceCalculation() {
    let sum = 0;
    basketlist.querySelectorAll(".main-card__item").forEach((element) => {
      element.querySelectorAll(".main-card__price").forEach((item) => {
        const price = parseInt(item.textContent);
        sum += price;
      });
    });
    document.querySelector(".basket-sum").textContent = "Total: " + sum;
  }
  priceCalculation();

  //видаляє всі елементи списка по натискані на CHECKOUT
  document.querySelector(".basket-btn").addEventListener("click", () => {
    basketlist.innerHTML = "";
    //міняє число над іконкою корзини кожен раз коли туди додається елемент
    document.querySelector(".header-items").textContent = basketlist.children.length;
    priceCalculation();
    saveToLocalStorage();
  });

  //події які викликають функцію mascategory та передає туди значення яке в послідовності виводиться на екран
  document.querySelector("#ALL").addEventListener("click", () => cardsElement(data));
  document.querySelector("#Beds").addEventListener("click", () => mascategory("beds"));
  document.querySelector("#Sofas").addEventListener("click", () => mascategory("sofas"));
  document.querySelector("#Wall").addEventListener("click", () => mascategory("wall"));

  //функція яка приймає значення з події та підставляє його на місце для перевірки на категорію і перенаправляє масив в функцію cardsElement
  function mascategory(category) {
    const Items = data.filter((item) => item.category === `${category}`);
    cardsElement(Items);
  }

  //пошук
  document.querySelector(".main-input__search").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        if (document.querySelector(".main-input__search").value != "") {
          const name = document.querySelector(".main-input__search").value;
          const nameMas = data.filter((item) => item.name == name);
          if (nameMas.length === 0) {
            cardsElement(data);
            alert("No such name exists");
          } else {
            cardsElement(nameMas);
          }
          document.querySelector(".main-input__search").value = "";
        }
      }
    });

  //slider
  document.querySelector("#flying").addEventListener("input", function () {
    const value = this.value;

    document.querySelector("#price").textContent = `price: ${value}грн`;

    const price = data.filter((item) => parseInt(item.price) <= parseInt(value));
    cardsElement(price);
  });

  cardsElement(data);
}

//функція яка зберігає всі елементи корзини в LocalStorage
function saveToLocalStorage() {
  const imgSrc = [];
  basketlist.querySelectorAll(".main-card__item").forEach((item) => {
    imgSrc.push({
      src: item.querySelector(".main-card__img").src,
      name: item.querySelector(".main-card__name").textContent,
      price: item.querySelector(".main-card__price").textContent,
      culation: item.querySelector(".basket-list__number__style").textContent,
    });
  });

  localStorage.setItem("exerciseList", JSON.stringify(imgSrc));
}

//функція яка рендерить корзину при загрузці сайту
function loadFromLocalStorage() {
  const items = JSON.parse(localStorage.getItem("exerciseList"));
  if (items) {
    let purpose = "";
    items.forEach((element) => {
      purpose += `
        <li class="main-card__item basket">
        <img class="main-card__img basket" src="${element.src}" alt="" />
        <div class="basket-list__information">
        <p class="main-card__name basket-push basket">${element.name}</p>
        <p class="main-card__price basket" data-original-price="${element.price}">${element.price}</p>
        <p class="basket-list__del main-card__name">remove</p>
        </div>
        <div class="basket-list__number">
        <img class="basket-list__number__vector" src="./images/vector-uphill.png" alt="">
        <p class="basket-list__number__style">${element.culation}</p>
        <img class="basket-list__number__vector__down" src="./images/vector-down.png" alt="">
        </div>
        </li>
        `;
    });
    basketlist.insertAdjacentHTML("afterbegin", purpose);
  }
}
list();
loadFromLocalStorage();
