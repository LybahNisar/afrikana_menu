// Lightbox
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = '<img id="lightbox-img" src="" alt=""><span id="lightbox-close">✕</span>';
document.body.appendChild(lightbox);

document.addEventListener('click', e => {
  const img = e.target.closest('.card-img img, .list-row-img, .platter-card img');
  if (img) {
    document.getElementById('lightbox-img').src = img.src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
});

lightbox.addEventListener('click', () => {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
});

// Tab navigation
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.menu-section');
const nav = document.getElementById('categoryNav');

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(target).classList.add('active');
    btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    const heroHeight = document.querySelector('.hero').offsetHeight;
    window.scrollTo({ top: heroHeight, behavior: 'smooth' });
  });
});

// Allergy warning modal initialization
const allergyModal = document.getElementById('allergy-modal');
const allergyCloseBtn = document.getElementById('allergy-close-btn');

if (allergyModal && !sessionStorage.getItem('allergy-warning-dismissed')) {
  setTimeout(() => {
    allergyModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }, 400);
}

if (allergyCloseBtn) {
  allergyCloseBtn.addEventListener('click', () => {
    allergyModal.classList.remove('active');
    document.body.style.overflow = '';
    sessionStorage.setItem('allergy-warning-dismissed', 'true');
  });
}

// ── ALLERGEN FINDER & MATRIX LOGIC ──
const allergenData = [
  {
    name: "Bite Me",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "May", "Fish": "May", "Peanuts": "No", "Soya": "May", "Milk": "Yes",
      "Nuts": "May", "Nuts: Almond": "May", "Nuts: Hazelnut": "May", "Nuts: Walnut": "May", "Nuts: Cashew": "May", "Nuts: Pecan": "May", "Nuts: Brazil": "May", "Nuts: Pistachio": "May", "Nuts: Macadamia": "May",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "May", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "Bite Me (Vegan)",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "No", "Fish": "No", "Peanuts": "May", "Soya": "Yes", "Milk": "No",
      "Nuts": "May", "Nuts: Almond": "May", "Nuts: Hazelnut": "May", "Nuts: Walnut": "May", "Nuts: Cashew": "May", "Nuts: Pecan": "May", "Nuts: Brazil": "May", "Nuts: Pistachio": "May", "Nuts: Macadamia": "May",
      "Sesame seeds": "May", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "Yes", "Mustard": "No", "Lupin": "No"
    }
  },
  {
    name: "Cheeky Chops",
    allergens: {
      "Gluten": "No", "Gluten: Wheat": "No", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "No", "Peanuts": "No", "Soya": "Yes", "Milk": "No",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "No", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "Hummus & Bread",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "No", "Fish": "No", "Peanuts": "No", "Soya": "May", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "Yes", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "No", "Mustard": "No", "Lupin": "No"
    }
  },
  {
    name: "Lady Fingers",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "May", "Fish": "May", "Peanuts": "No", "Soya": "May", "Milk": "May",
      "Nuts": "May", "Nuts: Almond": "May", "Nuts: Hazelnut": "May", "Nuts: Walnut": "May", "Nuts: Cashew": "May", "Nuts: Pecan": "May", "Nuts: Brazil": "May", "Nuts: Pistachio": "May", "Nuts: Macadamia": "May",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "May", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Let's Taco' Bout It?",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "May", "Nuts: Almond": "May", "Nuts: Hazelnut": "May", "Nuts: Walnut": "May", "Nuts: Cashew": "May", "Nuts: Pecan": "May", "Nuts: Brazil": "May", "Nuts: Pistachio": "May", "Nuts: Macadamia": "May",
      "Sesame seeds": "May", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "May", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Lets Taco Bout IT (Vegan)",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "No", "Fish": "No", "Peanuts": "May", "Soya": "Yes", "Milk": "No",
      "Nuts": "May", "Nuts: Almond": "May", "Nuts: Hazelnut": "May", "Nuts: Walnut": "May", "Nuts: Cashew": "May", "Nuts: Pecan": "May", "Nuts: Brazil": "May", "Nuts: Pistachio": "May", "Nuts: Macadamia": "May",
      "Sesame seeds": "Yes", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "May", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Loaded Fries Chicken",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "May", "Soya": "Yes", "Milk": "Yes",
      "Nuts": "May", "Nuts: Almond": "May", "Nuts: Hazelnut": "May", "Nuts: Walnut": "May", "Nuts: Cashew": "May", "Nuts: Pecan": "May", "Nuts: Brazil": "May", "Nuts: Pistachio": "May", "Nuts: Macadamia": "May",
      "Sesame seeds": "May", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "May", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Loaded Fries Pulled Beef",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "May", "Soya": "Yes", "Milk": "Yes",
      "Nuts": "May", "Nuts: Almond": "May", "Nuts: Hazelnut": "May", "Nuts: Walnut": "May", "Nuts: Cashew": "May", "Nuts: Pecan": "May", "Nuts: Brazil": "May", "Nuts: Pistachio": "May", "Nuts: Macadamia": "May",
      "Sesame seeds": "May", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "May", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Loaded Mac N Cheese Chicken",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "May", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "Yes",
      "Nuts": "May", "Nuts: Almond": "May", "Nuts: Hazelnut": "May", "Nuts: Walnut": "May", "Nuts: Cashew": "May", "Nuts: Pecan": "May", "Nuts: Brazil": "May", "Nuts: Pistachio": "May", "Nuts: Macadamia": "May",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "Yes", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Loaded Mac N Cheese Pulled Beef",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "May", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "Yes",
      "Nuts": "May", "Nuts: Almond": "May", "Nuts: Hazelnut": "May", "Nuts: Walnut": "May", "Nuts: Cashew": "May", "Nuts: Pecan": "May", "Nuts: Brazil": "May", "Nuts: Pistachio": "May", "Nuts: Macadamia": "May",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "Yes", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Nachos",
    allergens: {
      "Gluten": "No", "Gluten: Wheat": "No", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "No", "Peanuts": "No", "Soya": "Yes", "Milk": "Yes",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "Yes", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "No", "Mustard": "No", "Lupin": "No"
    }
  },
  {
    name: "Nachos - Chicken",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "Yes",
      "Nuts": "May", "Nuts: Almond": "May", "Nuts: Hazelnut": "May", "Nuts: Walnut": "May", "Nuts: Cashew": "May", "Nuts: Pecan": "May", "Nuts: Brazil": "May", "Nuts: Pistachio": "May", "Nuts: Macadamia": "May",
      "Sesame seeds": "No", "Sulphur dioxide": "Yes", "Molluscs": "No", "Celery": "May", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "Prawns To Be Wild",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "Yes", "Eggs": "Yes", "Fish": "Yes", "Peanuts": "No", "Soya": "May", "Milk": "May",
      "Nuts": "May", "Nuts: Almond": "May", "Nuts: Hazelnut": "May", "Nuts: Walnut": "May", "Nuts: Cashew": "May", "Nuts: Pecan": "May", "Nuts: Brazil": "May", "Nuts: Pistachio": "May", "Nuts: Macadamia": "May",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "Yes", "Celery": "May", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Put A Wing on It",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "May", "Fish": "May", "Peanuts": "May", "Soya": "May", "Milk": "Yes",
      "Nuts": "May", "Nuts: Almond": "May", "Nuts: Hazelnut": "May", "Nuts: Walnut": "May", "Nuts: Cashew": "May", "Nuts: Pecan": "May", "Nuts: Brazil": "May", "Nuts: Pistachio": "May", "Nuts: Macadamia": "May",
      "Sesame seeds": "May", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "May", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "We'll Have it All",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "May", "Soya": "May", "Milk": "Yes",
      "Nuts": "May", "Nuts: Almond": "May", "Nuts: Hazelnut": "May", "Nuts: Walnut": "May", "Nuts: Cashew": "May", "Nuts: Pecan": "May", "Nuts: Brazil": "May", "Nuts: Pistachio": "May", "Nuts: Macadamia": "May",
      "Sesame seeds": "Yes", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "May", "Mustard": "Yes", "Lupin": "No"
    }
  }
,
  {
    name: "The Afrikana Fruit Punch",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "Yes",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Carnival Colada",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "Yes",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "The West African Cháps",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "Yes",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Zobo Zombie Cháps",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "Yes",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Passion",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "Yes",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Strawberry Drip",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "Yes",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Beauty & The Beast",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Bubblegum",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Classic",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "Yes",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Island Dream",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "Yes",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  }
,
  {
    name: "Baking My Heart",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "Yes",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "No",       "Peanuts": "May",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "May",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "May",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Desserts - Chocolate Ice Cream",
    allergens: {
            "Gluten": "May",       "Gluten: Wheat": "May",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "May",       "Fish": "No",       "Peanuts": "No",       "Soya": "May",       "Milk": "Yes",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Desserts - Coconut Ice Cream",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "Yes",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Desserts - Mango Ice Cream",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "Yes",       "Soya": "Yes",       "Milk": "May",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Desserts - Vanilla Ice Cream",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "May",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Fudge It",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "May",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "No",       "Peanuts": "May",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "Yes",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Stack It Up",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "May",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "No",       "Peanuts": "Yes",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "You're So Lavly",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "May",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "No",       "Peanuts": "May",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  }
,
  {
    name: "Afrikana Salad",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "Yes",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "Yes",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Afrikana Salad Chicken",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "May",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "Yes",       "Sulphur dioxide": "No",       "Molluscs": "May",       "Celery": "Yes",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Afrikana Salad Halloumi",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "Yes",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "Yes",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "All At Steak",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "May",       "Sulphur dioxide": "No",       "Molluscs": "May",       "Celery": "May",       "Mustard": "May",       "Lupin": "No"
    }
  },
  {
    name: "Bunny Chow",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "May",       "Peanuts": "No",       "Soya": "May",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "May",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "Yes",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Chicken Date",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "May",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "May",       "Sulphur dioxide": "No",       "Molluscs": "May",       "Celery": "May",       "Mustard": "May",       "Lupin": "No"
    }
  },
  {
    name: "Island Fish & Chips",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "Yes",       "Peanuts": "No",       "Soya": "May",       "Milk": "May",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "No",       "Sulphur dioxide": "May",       "Molluscs": "No",       "Celery": "May",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Jammin' Jambalaya",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "Yes",       "Eggs": "May",       "Fish": "Yes",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "May",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "May",       "Sulphur dioxide": "Yes",       "Molluscs": "Yes",       "Celery": "Yes",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Jammin' Jambalaya (Veg)",
    allergens: {
            "Gluten": "May",       "Gluten: Wheat": "May",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "May",       "Peanuts": "No",       "Soya": "May",       "Milk": "May",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "May",       "Sulphur dioxide": "No",       "Molluscs": "Yes",       "Celery": "Yes",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Just Kebabin'",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "No",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "May",       "Lupin": "No"
    }
  },
  {
    name: "Just Kebabin Chicken",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "No",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "May",       "Lupin": "No"
    }
  },
  {
    name: "Just Kebabin Lamb",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "No",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "May",       "Lupin": "No"
    }
  },
  {
    name: "Spicy Chicken Date",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "May",       "Fish": "No",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "May",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "May",       "Sulphur dioxide": "No",       "Molluscs": "May",       "Celery": "May",       "Mustard": "May",       "Lupin": "No"
    }
  },
  {
    name: "Steak It On Me",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "May",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "No",       "Sulphur dioxide": "May",       "Molluscs": "No",       "Celery": "May",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "The Salmon Cure",
    allergens: {
            "Gluten": "May",       "Gluten: Wheat": "May",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "Yes",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "May",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "May",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "Yes",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "We Goat Your Back",
    allergens: {
            "Gluten": "May",       "Gluten: Wheat": "May",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "May",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "May",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "Yes",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Prawn To Be Wild",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "Yes",       "Eggs": "Yes",       "Fish": "Yes",       "Peanuts": "No",       "Soya": "May",       "Milk": "May",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "No",       "Sulphur dioxide": "May",       "Molluscs": "Yes",       "Celery": "May",       "Mustard": "Yes",       "Lupin": "No"
    }
  }
,
  {
    name: "Cháps Premium Chapman",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Cháps Premium Zobo",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Fruit Shoot",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Soft - Fruit Shoot Apple & Blackcurrant",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Soft - Fruit Shoot Orange",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "J2O",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Soft Drinks - J20 Apple & Mango",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Soft Drinks - J20 Apple & Raspberry",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Soft Drinks - J20 Orange & Passion Fruit",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Drip Still Water",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Drip Sparkling Water",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Soft Drinks - Still Water",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Soft Drinks - Sparkling Water",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Juices",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Soft Drinks - Pineapple Juice",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Soft Drinks - Apple Juice",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Soft Drinks - Mango Juice",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Soft Drinks - Orange Juice",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Cola",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Diet Cola",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Soft Drinks - Coca Cola",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Soft Drinks - Coke Zero",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Soft Drinks - Diet Coke",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Soft Drinks - Fanta",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Soft Drinks - Sprite",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Irn Bru",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Soft Drinks - Irn Bru",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Jarritos",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Soft Drinks - Appletiser",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Dr Pepper",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Hot Drinks",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  }
,
  {
    name: "Slide In The DM's",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "Yes",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "May",       "Sulphur dioxide": "May",       "Molluscs": "No",       "Celery": "May",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Big Poppa",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "May",       "Gluten: Barley": "May",       "Gluten: Oats": "May",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "May",       "Sulphur dioxide": "May",       "Molluscs": "No",       "Celery": "May",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Bun True Love",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "May",       "Gluten: Barley": "May",       "Gluten: Oats": "May",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "May",       "Sulphur dioxide": "May",       "Molluscs": "No",       "Celery": "May",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Butterfly Bun",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "May",       "Gluten: Barley": "May",       "Gluten: Oats": "May",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "May",       "Sulphur dioxide": "May",       "Molluscs": "No",       "Celery": "May",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Meant To Bean VE",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "May",       "Gluten: Barley": "May",       "Gluten: Oats": "May",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "No",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "May",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "May",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Thic Chick",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "May",       "Gluten: Barley": "May",       "Gluten: Oats": "May",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "May",       "Sulphur dioxide": "May",       "Molluscs": "No",       "Celery": "May",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Edgy–Veggie Wrap V",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "No",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "Yes",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "That's A Wrap",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "Yes",       "Sulphur dioxide": "No",       "Molluscs": "May",       "Celery": "May",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Burgers - Slide In The DM's",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "Yes",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "May",       "Sulphur dioxide": "May",       "Molluscs": "No",       "Celery": "May",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Burgers - Big Poppa",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "May",       "Gluten: Barley": "May",       "Gluten: Oats": "May",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "May",       "Sulphur dioxide": "May",       "Molluscs": "No",       "Celery": "May",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Burgers - Bun True Love",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "May",       "Gluten: Barley": "May",       "Gluten: Oats": "May",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "May",       "Sulphur dioxide": "May",       "Molluscs": "No",       "Celery": "May",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Burgers - Butterfly Bun",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "May",       "Gluten: Barley": "May",       "Gluten: Oats": "May",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "May",       "Sulphur dioxide": "May",       "Molluscs": "No",       "Celery": "May",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Burgers - Meant To Bean",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "May",       "Gluten: Barley": "May",       "Gluten: Oats": "May",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "No",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "May",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "May",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Burgers - Thic Chick",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "May",       "Gluten: Barley": "May",       "Gluten: Oats": "May",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "May",       "Sulphur dioxide": "May",       "Molluscs": "No",       "Celery": "May",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Wrap - Edgy Veggie",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "No",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "Yes",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Wrap - That's a Wrap",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "Yes",       "Sulphur dioxide": "No",       "Molluscs": "May",       "Celery": "May",       "Mustard": "Yes",       "Lupin": "No"
    }
  }
,
  {
    name: "Chickadee",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "May",       "Gluten: Barley": "May",       "Gluten: Oats": "May",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "May",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "May",       "Sulphur dioxide": "May",       "Molluscs": "No",       "Celery": "May",       "Mustard": "May",       "Lupin": "No"
    }
  },
  {
    name: "Hulk Smash",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "May",       "Gluten: Barley": "May",       "Gluten: Oats": "May",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "May",       "Fish": "No",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "May",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "May",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Lil' Fish Fry",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "May",       "Fish": "Yes",       "Peanuts": "No",       "Soya": "No",       "Milk": "May",       "Nuts": "May",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Tiny Tenders",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "May",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "May",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "May",       "Mustard": "May",       "Lupin": "No"
    }
  },
  {
    name: "Rotisserie Chicken",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "May", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Afrikana Fries",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "Yes",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Fresh Coleslaw",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "May",       "Lupin": "No"
    }
  },
  {
    name: "Flatbread",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Fries",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Halloumi Fries",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "Yes",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Jollof Rice",
    allergens: {
            "Gluten": "May",       "Gluten: Wheat": "May",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "May",       "Soya": "No",       "Milk": "May",       "Nuts": "May",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "May",       "Molluscs": "No",       "Celery": "Yes",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Mac 'N Cheese",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "May",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "May",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "Yes",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Loaded Mac 'N Cheese",
    allergens: {
            "Gluten": "Yes",       "Gluten: Wheat": "Yes",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "May",       "Fish": "May",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "Yes",       "Nuts": "May",       "Nuts: Almond": "May",       "Nuts: Hazelnut": "May",       "Nuts: Walnut": "May",       "Nuts: Cashew": "May",       "Nuts: Pecan": "May",       "Nuts: Brazil": "May",       "Nuts: Pistachio": "May",       "Nuts: Macadamia": "May",       "Sesame seeds": "May",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "Yes",       "Mustard": "Yes",       "Lupin": "No"
    }
  },
  {
    name: "Loaded Fries",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "Yes",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "Yes",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Mashed Potato",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "Yes",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Plantain",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "Yes",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Rice 'N Peas",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Side Salad",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "Sweet Potato Fries",
    allergens: {
            "Gluten": "No",       "Gluten: Wheat": "No",       "Gluten: Rye": "No",       "Gluten: Barley": "No",       "Gluten: Oats": "No",       "Gluten: Spelt": "No",       "Gluten: Kamut": "No",       "Crustaceans": "No",       "Eggs": "No",       "Fish": "No",       "Peanuts": "No",       "Soya": "No",       "Milk": "No",       "Nuts": "No",       "Nuts: Almond": "No",       "Nuts: Hazelnut": "No",       "Nuts: Walnut": "No",       "Nuts: Cashew": "No",       "Nuts: Pecan": "No",       "Nuts: Brazil": "No",       "Nuts: Pistachio": "No",       "Nuts: Macadamia": "No",       "Sesame seeds": "No",       "Sulphur dioxide": "No",       "Molluscs": "No",       "Celery": "No",       "Mustard": "No",       "Lupin": "No"
    }
  },
  {
    name: "BBQ / Jerk Sauce",
    allergens: {
      "Gluten": "No", "Gluten: Wheat": "No", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "No", "Fish": "No", "Peanuts": "No", "Soya": "No", "Milk": "No",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "Yes", "Molluscs": "No", "Celery": "No", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Chocolate Sauce",
    allergens: {
      "Gluten": "No", "Gluten: Wheat": "No", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "No", "Fish": "No", "Peanuts": "No", "Soya": "Yes", "Milk": "No",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "No", "Mustard": "No", "Lupin": "No"
    }
  },
  {
    name: "Creole Mayo",
    allergens: {
      "Gluten": "No", "Gluten: Wheat": "No", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "No", "Peanuts": "No", "Soya": "No", "Milk": "No",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "No", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Fire Sauce",
    allergens: {
      "Gluten": "No", "Gluten: Wheat": "No", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "No", "Fish": "No", "Peanuts": "No", "Soya": "No", "Milk": "No",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "No", "Mustard": "No", "Lupin": "No"
    }
  },
  {
    name: "Garlic Mayo",
    allergens: {
      "Gluten": "No", "Gluten: Wheat": "No", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "No", "Peanuts": "No", "Soya": "No", "Milk": "No",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "No", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "Hot & Honey Sauce New",
    allergens: {
      "Gluten": "No", "Gluten: Wheat": "No", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "No", "Fish": "No", "Peanuts": "May", "Soya": "No", "Milk": "No",
      "Nuts": "May", "Nuts: Almond": "May", "Nuts: Hazelnut": "May", "Nuts: Walnut": "May", "Nuts: Cashew": "May", "Nuts: Pecan": "May", "Nuts: Brazil": "May", "Nuts: Pistachio": "May", "Nuts: Macadamia": "May",
      "Sesame seeds": "No", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "No", "Mustard": "No", "Lupin": "No"
    }
  },
  {
    name: "Lamb Chop Sauce",
    allergens: {
      "Gluten": "No", "Gluten: Wheat": "No", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "May", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "May", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "No", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "Nacho Cheese Sauce",
    allergens: {
      "Gluten": "No", "Gluten: Wheat": "No", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "No", "Fish": "No", "Peanuts": "No", "Soya": "Yes", "Milk": "Yes",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "No", "Mustard": "No", "Lupin": "No"
    }
  },
  {
    name: "Sauce - Afrikana",
    allergens: {
      "Gluten": "No", "Gluten: Wheat": "No", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "No", "Fish": "No", "Peanuts": "No", "Soya": "No", "Milk": "No",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "No", "Mustard": "No", "Lupin": "No"
    }
  },
  {
    name: "Sauce - Lemon & Leaves",
    allergens: {
      "Gluten": "No", "Gluten: Wheat": "No", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "No", "Fish": "No", "Peanuts": "No", "Soya": "No", "Milk": "No",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "No", "Mustard": "No", "Lupin": "No"
    }
  },
  {
    name: "Sauce - Mixed Peri",
    allergens: {
      "Gluten": "No", "Gluten: Wheat": "No", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "No", "Fish": "No", "Peanuts": "No", "Soya": "No", "Milk": "No",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "No", "Mustard": "No", "Lupin": "No"
    }
  },
  {
    name: "Sriracha Mayo",
    allergens: {
      "Gluten": "No", "Gluten: Wheat": "No", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "No", "Peanuts": "No", "Soya": "No", "Milk": "No",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "No", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Tartare Sauce",
    allergens: {
      "Gluten": "No", "Gluten: Wheat": "No", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "No", "Peanuts": "No", "Soya": "No", "Milk": "No",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "No", "Molluscs": "No", "Celery": "No", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Wild Herb Sauce",
    allergens: {
      "Gluten": "May", "Gluten: Wheat": "May", "Gluten: Rye": "May", "Gluten: Barley": "May", "Gluten: Oats": "May", "Gluten: Spelt": "May", "Gluten: Kamut": "May",
      "Crustaceans": "No", "Eggs": "May", "Fish": "No", "Peanuts": "No", "Soya": "May", "Milk": "No",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "Yes", "Molluscs": "No", "Celery": "No", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "10 Wings",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "May", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "3 Wings",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "May", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "5 Wings",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "May", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "Butterfly Chicken",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "May", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "Cheeky Pitta",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "May", "Nuts: Almond": "May", "Nuts: Hazelnut": "May", "Nuts: Walnut": "May", "Nuts: Cashew": "May", "Nuts: Pecan": "May", "Nuts: Brazil": "May", "Nuts: Pistachio": "May", "Nuts: Macadamia": "May",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "No", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Chicken Thighs",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "May", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "Fried Chicken Is Life",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "Yes",
      "Nuts": "May", "Nuts: Almond": "May", "Nuts: Hazelnut": "May", "Nuts: Walnut": "May", "Nuts: Cashew": "May", "Nuts: Pecan": "May", "Nuts: Brazil": "May", "Nuts: Pistachio": "May", "Nuts: Macadamia": "May",
      "Sesame seeds": "No", "Sulphur dioxide": "Yes", "Molluscs": "No", "Celery": "May", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Full Chicken",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "May", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "Whole Chicken",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "May", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "Half Chicken",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "May", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "Knockout Box",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "Yes", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Knockout Box Vegan",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "No", "Fish": "May", "Peanuts": "No", "Soya": "May", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "Yes", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Quarter Chicken",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "May", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "What Cheese Said",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "Yes",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "Yes", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Three Wings",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "May", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "Five Wings",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "May", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "Ten Wings",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "May", "Mustard": "May", "Lupin": "No"
    }
  },
  {
    name: "Chit-Chats & Chicken",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "Yes",
      "Nuts": "May", "Nuts: Almond": "May", "Nuts: Hazelnut": "May", "Nuts: Walnut": "May", "Nuts: Cashew": "May", "Nuts: Pecan": "May", "Nuts: Brazil": "May", "Nuts: Pistachio": "May", "Nuts: Macadamia": "May",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "Yes", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Platters - Chit-Chats & Chicken",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "Yes",
      "Nuts": "May", "Nuts: Almond": "May", "Nuts: Hazelnut": "May", "Nuts: Walnut": "May", "Nuts: Cashew": "May", "Nuts: Pecan": "May", "Nuts: Brazil": "May", "Nuts: Pistachio": "May", "Nuts: Macadamia": "May",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "Yes", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Kickin' In Kenya",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "Yes", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Platters - Kickin in Kenya",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "No", "Eggs": "Yes", "Fish": "May", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "No", "Celery": "Yes", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "We Meat Again",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "Yes", "Eggs": "Yes", "Fish": "Yes", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "Yes", "Celery": "Yes", "Mustard": "Yes", "Lupin": "No"
    }
  },
  {
    name: "Platters - We Meat Again",
    allergens: {
      "Gluten": "Yes", "Gluten: Wheat": "Yes", "Gluten: Rye": "No", "Gluten: Barley": "No", "Gluten: Oats": "No", "Gluten: Spelt": "No", "Gluten: Kamut": "No",
      "Crustaceans": "Yes", "Eggs": "Yes", "Fish": "Yes", "Peanuts": "No", "Soya": "Yes", "Milk": "May",
      "Nuts": "No", "Nuts: Almond": "No", "Nuts: Hazelnut": "No", "Nuts: Walnut": "No", "Nuts: Cashew": "No", "Nuts: Pecan": "No", "Nuts: Brazil": "No", "Nuts: Pistachio": "No", "Nuts: Macadamia": "No",
      "Sesame seeds": "No", "Sulphur dioxide": "May", "Molluscs": "Yes", "Celery": "Yes", "Mustard": "Yes", "Lupin": "No"
    }
  }
];

// ── PROGRAMMATIC DEDUPLICATION & NORMALIZATION ──
(function() {
  const canonicalMap = {
    "10 Wings": "Ten Wings",
    "3 Wings": "Three Wings",
    "5 Wings": "Five Wings",
    "Platters - Chit-Chats & Chicken": "Chit-Chats & Chicken",
    "Platters - Kickin in Kenya": "Kickin' In Kenya",
    "Platters - We Meat Again": "We Meat Again",
    "Prawns To Be Wild": "Prawn To Be Wild",
    "Burgers - Slide In The DM's": "Slide In The DM's",
    "Burgers - Big Poppa": "Big Poppa",
    "Burgers - Bun True Love": "Bun True Love",
    "Burgers - Butterfly Bun": "Butterfly Bun",
    "Burgers - Meant To Bean": "Meant To Bean VE",
    "Burgers - Thic Chick": "Thic Chick",
    "Wrap - Edgy Veggie": "Edgy–Veggie Wrap V",
    "Wrap - That's a Wrap": "That's A Wrap",
    "Soft Drinks - Still Water": "Drip Still Water",
    "Soft Drinks - Sparkling Water": "Drip Sparkling Water",
    "Soft Drinks - Coca Cola": "Cola",
    "Soft Drinks - Coke Zero": "Diet Cola",
    "Soft Drinks - Diet Coke": "Diet Cola",
    "Soft Drinks - Irn Bru": "Irn Bru",
    "Soft Drinks - J20 Apple & Mango": "J2O",
    "Soft Drinks - J20 Apple & Raspberry": "J2O",
    "Soft Drinks - J20 Orange & Passion Fruit": "J2O",
    "Soft Drinks - Pineapple Juice": "Juices",
    "Soft Drinks - Apple Juice": "Juices",
    "Soft Drinks - Mango Juice": "Juices",
    "Soft Drinks - Orange Juice": "Juices",
    "Soft - Fruit Shoot Apple & Blackcurrant": "Fruit Shoot",
    "Soft - Fruit Shoot Orange": "Fruit Shoot",
    "We'll Have it All": "We'll Have It All",
    "Put A Wing on It": "Put A Wing On It"
  };

  function mergeAllergens(a, b) {
    const merged = { ...a };
    for (const [key, val] of Object.entries(b)) {
      const current = merged[key];
      if (val === 'Yes' || current === 'Yes') {
        merged[key] = 'Yes';
      } else if (val === 'May' || current === 'May') {
        merged[key] = 'May';
      } else {
        merged[key] = 'No';
      }
    }
    return merged;
  }

  const deduplicatedAllergenData = [];
  const nameToItemMap = new Map();

  allergenData.forEach(item => {
    const canonicalName = canonicalMap[item.name] || item.name;
    if (nameToItemMap.has(canonicalName)) {
      const existing = nameToItemMap.get(canonicalName);
      existing.allergens = mergeAllergens(existing.allergens, item.allergens);
    } else {
      const newItem = {
        name: canonicalName,
        allergens: { ...item.allergens }
      };
      nameToItemMap.set(canonicalName, newItem);
      deduplicatedAllergenData.push(newItem);
    }
  });

  // Mutate the const allergenData array in-place so all other parts of the script consume it
  allergenData.splice(0, allergenData.length, ...deduplicatedAllergenData);
})();

// Tab Switching
const allergenTabBtns = document.querySelectorAll('.allergen-tab-btn');
const allergenTabContents = document.querySelectorAll('.allergen-tab-content');

if (allergenTabBtns.length > 0) {
  allergenTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      allergenTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      allergenTabContents.forEach(content => {
        if (content.id === 'tab-' + tabId) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });
}

// Finder Filter Logic
const selectedExclusions = new Set();
const toggles = document.querySelectorAll('.allergen-toggle');
const resultsList = document.getElementById('finderResultsList');
const clearBtn = document.getElementById('clearFinderBtn');

// Map of all menu items in index.html to their respective section IDs
const htmlMapping = {
  "We'll Have It All": "small-bites",
  "Nachos": "small-bites",
  "Cheeky Chops": "small-bites",
  "Let's Taco' Bout It?": "small-bites",
  "Hummus & Bread": "small-bites",
  "Prawn To Be Wild": "small-bites",
  "Loaded Fries": "small-bites",
  "Loaded Mac 'N Cheese": "small-bites",
  "Lady Fingers": "small-bites",
  "Bite Me": "small-bites",
  "Put A Wing On It": "small-bites",
  "Quarter Chicken": "chicken",
  "Half Chicken": "chicken",
  "Whole Chicken": "chicken",
  "Butterfly Chicken": "chicken",
  "Chicken Thighs": "chicken",
  "Three Wings": "chicken",
  "Five Wings": "chicken",
  "Ten Wings": "chicken",
  "Knockout Box": "chicken",
  "What Cheese Said": "chicken",
  "Fried Chicken Is Life": "chicken",
  "Rotisserie Chicken": "chicken",
  "Slide In The DM's": "burgers-wraps",
  "Thic Chick": "burgers-wraps",
  "Butterfly Bun": "burgers-wraps",
  "Big Poppa": "burgers-wraps",
  "Bun True Love": "burgers-wraps",
  "Meant To Bean VE": "burgers-wraps",
  "That's A Wrap": "burgers-wraps",
  "Edgy–Veggie Wrap V": "burgers-wraps",
  "Chicken Date": "specials",
  "All At Steak": "specials",
  "Just Kebabin'": "specials",
  "Afrikana Salad": "specials",
  "Steak It On Me": "specials",
  "Jammin' Jambalaya": "specials",
  "We Goat Your Back": "specials",
  "Bunny Chow": "specials",
  "Island Fish & Chips": "specials",
  "The Salmon Cure": "specials",
  "Chit-Chats & Chicken": "sharing-platters",
  "Kickin' In Kenya": "sharing-platters",
  "We Meat Again": "sharing-platters",
  "Fries": "sides",
  "Afrikana Fries": "sides",
  "Mac 'N Cheese": "sides",
  "Jollof Rice": "sides",
  "Plantain": "sides",
  "Rice 'N Peas": "sides",
  "Mashed Potato": "sides",
  "Fresh Coleslaw": "sides",
  "Sweet Potato Fries": "sides",
  "Halloumi Fries": "sides",
  "Flatbread": "sides",
  "Side Salad": "sides",
  "Chickadee": "kids",
  "Hulk Smash": "kids",
  "Tiny Tenders": "kids",
  "Lil' Fish Fry": "kids",
  "Classic": "mojitos",
  "Passion": "mojitos",
  "Strawberry Drip": "mojitos",
  "Bubblegum": "mojitos",
  "The Afrikana Fruit Punch": "mocktails",
  "Beauty & The Beast": "mocktails",
  "The West African Cháps": "mocktails",
  "Island Dream": "mocktails",
  "Carnival Colada": "mocktails",
  "Zobo Zombie Cháps": "mocktails",
  "Cola": "soft-drinks",
  "Diet Cola": "soft-drinks",
  "Jarritos": "soft-drinks",
  "Irn Bru": "soft-drinks",
  "Drip Still Water": "soft-drinks",
  "Drip Sparkling Water": "soft-drinks",
  "Fruit Shoot": "soft-drinks",
  "Cháps Premium Chapman": "soft-drinks",
  "Cháps Premium Zobo": "soft-drinks",
  "J2O": "soft-drinks",
  "Juices": "soft-drinks",
  "Hot Drinks": "soft-drinks",
  "Stack It Up": "desserts",
  "Baking My Heart": "desserts",
  "You're So Lavly": "desserts",
  "Fudge It": "desserts"
};

const categoryMetadata = {
  'small-bites': { title: 'Small Bites', icon: '🍗' },
  'chicken': { title: 'Chicken', icon: '🔥' },
  'burgers-wraps': { title: 'Burgers & Wraps', icon: '🍔' },
  'specials': { title: 'Specials', icon: '⭐' },
  'sharing-platters': { title: 'Sharing Platters', icon: '🫕' },
  'sides': { title: 'Sides', icon: '🍟' },
  'kids': { title: 'Kids Menu', icon: '🧒' },
  'mojitos': { title: 'Mojitos', icon: '🍹' },
  'mocktails': { title: 'Mocktails', icon: '🍸' },
  'soft-drinks': { title: 'Soft Drinks', icon: '🥤' },
  'desserts': { title: 'Desserts', icon: '🍮' },
  'sauces': { title: 'Sauces & Extras', icon: '🏺' }
};

function getWords(str) {
  return str.toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function getItemCategory(name) {
  const lower = name.toLowerCase();
  
  // Prefix checks
  if (lower.startsWith('desserts -') || lower.startsWith('dessert -')) return 'desserts';
  if (lower.startsWith('soft drinks -') || lower.startsWith('soft drink -') || lower.startsWith('soft -')) return 'soft-drinks';
  if (lower.startsWith('burgers -') || lower.startsWith('burger -')) return 'burgers-wraps';
  if (lower.startsWith('wrap -')) return 'burgers-wraps';
  if (lower.startsWith('platters -') || lower.startsWith('platter -')) return 'sharing-platters';
  if (lower.startsWith('sauce -')) return 'sauces';

  // Specific name overrides
  if (lower.includes('prawn to be wild') || lower.includes('prawns to be wild')) return 'small-bites';
  if (lower === 'dr pepper') return 'soft-drinks';
  
  // Word boundary/subset check
  const nameWords = getWords(name);
  
  for (const [key, cat] of Object.entries(htmlMapping)) {
    const keyLower = key.toLowerCase();
    if (keyLower === lower) return cat;
    
    const keyWords = getWords(key);
    const isSubset = keyWords.every(word => nameWords.includes(word));
    if (isSubset) {
      return cat;
    }
  }

  // Fallback keyword checks
  if (lower.includes('platters') || lower.includes('platter')) {
    return 'sharing-platters';
  }
  
  if (lower.includes('sauce') || lower.includes('mayo') || lower.includes('ketchup') || lower.includes('chutney')) {
    return 'sauces';
  }

  if (lower.includes('wing') || lower.includes('chicken') || lower.includes('box')) {
    return 'chicken';
  }
  if (lower.includes('wrap') || lower.includes('pitta') || lower.includes('burger') || lower.includes('bun')) {
    return 'burgers-wraps';
  }
  if (lower.includes('fries') || lower.includes('mac')) {
    return 'sides';
  }
  if (lower.includes('colada') || lower.includes('punch') || lower.includes('chaps') || lower.includes('cháps')) {
    return 'mocktails';
  }
  
  return 'sauces'; // fallback
}

function updateFinder() {
  if (!resultsList) return;
  resultsList.innerHTML = '';
  
  const groups = {
    'small-bites': [],
    'chicken': [],
    'burgers-wraps': [],
    'specials': [],
    'sharing-platters': [],
    'sides': [],
    'kids': [],
    'mojitos': [],
    'mocktails': [],
    'soft-drinks': [],
    'desserts': [],
    'sauces': []
  };
  
  allergenData.forEach(item => {
    let status = 'safe'; // default
    let matchedExclusions = [];
    
    selectedExclusions.forEach(exclusion => {
      let hasAllergen = 'No';
      
      if (exclusion === 'Gluten') {
        const glutenKeys = ["Gluten", "Gluten: Wheat", "Gluten: Rye", "Gluten: Barley", "Gluten: Oats", "Gluten: Spelt", "Gluten: Kamut"];
        glutenKeys.forEach(k => {
          if (item.allergens[k] === 'Yes') hasAllergen = 'Yes';
          else if (item.allergens[k] === 'May' && hasAllergen !== 'Yes') hasAllergen = 'May';
        });
      } else if (exclusion === 'Nuts') {
        const nutKeys = ["Nuts", "Nuts: Almond", "Nuts: Hazelnut", "Nuts: Walnut", "Nuts: Cashew", "Nuts: Pecan", "Nuts: Brazil", "Nuts: Pistachio", "Nuts: Macadamia", "Peanuts"];
        nutKeys.forEach(k => {
          if (item.allergens[k] === 'Yes') hasAllergen = 'Yes';
          else if (item.allergens[k] === 'May' && hasAllergen !== 'Yes') hasAllergen = 'May';
        });
      } else {
        hasAllergen = item.allergens[exclusion] || 'No';
      }
      
      if (hasAllergen === 'Yes') {
        status = 'contains';
        matchedExclusions.push(exclusion);
      } else if (hasAllergen === 'May' && status !== 'contains') {
        status = 'may';
        matchedExclusions.push(exclusion);
      }
    });
    
    const card = document.createElement('div');
    card.className = 'result-card ' + (status === 'contains' ? 'contains-allergen' : status === 'may' ? 'may-contain' : 'safe');
    
    let statusText = 'Safe';
    if (status === 'contains') statusText = 'Contains Selected Allergen(s)';
    if (status === 'may') statusText = 'May Contain Selected Allergen(s)';
    
    let exclusionsHtml = '';
    if (matchedExclusions.length > 0) {
      exclusionsHtml = '<div class="result-exclusions">Contains/May Contain: ' + matchedExclusions.join(', ') + '</div>';
    }
    
    card.innerHTML = '<div class="result-card-info"><h5>' + item.name + '</h5><div class="result-status-text">' + statusText + '</div>' + exclusionsHtml + '</div>';
    
    const category = getItemCategory(item.name);
    if (groups[category]) {
      groups[category].push(card);
    } else {
      groups['sauces'].push(card);
    }
  });
  
  // Render grouped results as accordion dropdowns
  Object.keys(groups).forEach(catId => {
    const cards = groups[catId];
    if (cards.length > 0) {
      const meta = categoryMetadata[catId] || { title: catId, icon: '✨' };
      
      const groupDiv = document.createElement('div');
      groupDiv.className = 'finder-category-group accordion-group';
      
      const titleDiv = document.createElement('div');
      titleDiv.className = 'finder-category-title accordion-toggle open';
      titleDiv.innerHTML =
        '<span class="category-icon">' + meta.icon + '</span>' +
        '<span class="accordion-label">' + meta.title + ' <span class="accordion-count">(' + cards.length + ')</span></span>' +
        '<span class="accordion-chevron">▾</span>';
      
      const cardsDiv = document.createElement('div');
      cardsDiv.className = 'finder-category-cards accordion-body';
      
      cards.forEach(card => {
        cardsDiv.appendChild(card);
      });
      
      // Toggle on click
      titleDiv.addEventListener('click', () => {
        const isOpen = titleDiv.classList.contains('open');
        if (isOpen) {
          titleDiv.classList.remove('open');
          cardsDiv.style.maxHeight = '0';
          cardsDiv.style.opacity = '0';
        } else {
          titleDiv.classList.add('open');
          cardsDiv.style.maxHeight = cardsDiv.scrollHeight + 'px';
          cardsDiv.style.opacity = '1';
        }
      });
      
      // Default: open
      cardsDiv.style.maxHeight = '9999px';
      cardsDiv.style.opacity = '1';
      
      groupDiv.appendChild(titleDiv);
      groupDiv.appendChild(cardsDiv);
      resultsList.appendChild(groupDiv);
    }
  });
}

if (toggles.length > 0) {
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const allergen = toggle.getAttribute('data-allergen');
      if (selectedExclusions.has(allergen)) {
        selectedExclusions.delete(allergen);
        toggle.classList.remove('active');
      } else {
        selectedExclusions.add(allergen);
        toggle.classList.add('active');
      }
      updateFinder();
    });
  });
}

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    selectedExclusions.clear();
    toggles.forEach(t => t.classList.remove('active'));
    updateFinder();
  });
}

// Matrix Render
const matrixTable = document.getElementById('allergenMatrixTable');
if (matrixTable) {
  const allergenList = [
    "Gluten", "Gluten: Wheat", "Gluten: Rye", "Gluten: Barley", "Gluten: Oats", "Gluten: Spelt", "Gluten: Kamut",
    "Crustaceans", "Eggs", "Fish", "Peanuts", "Soya", "Milk",
    "Nuts", "Nuts: Almond", "Nuts: Hazelnut", "Nuts: Walnut", "Nuts: Cashew", "Nuts: Pecan", "Nuts: Brazil", "Nuts: Pistachio", "Nuts: Macadamia",
    "Sesame seeds", "Sulphur dioxide", "Molluscs", "Celery", "Mustard", "Lupin"
  ];
  
  // Create Header Row
  let headerHtml = '<thead><tr><th class="dish-header">Dish / Allergen</th>';
  allergenList.forEach(allg => {
    let label = allg;
    if (allg.startsWith('Gluten: ')) label = allg.replace('Gluten: ', '🌾 ');
    else if (allg.startsWith('Nuts: ')) label = allg.replace('Nuts: ', '🥜 ');
    else if (allg === 'Gluten') label = '🌾 Gluten';
    else if (allg === 'Nuts') label = '🥜 Nuts';
    else if (allg === 'Crustaceans') label = '🦐 Crust';
    else if (allg === 'Eggs') label = '🥚 Eggs';
    else if (allg === 'Fish') label = '🐟 Fish';
    else if (allg === 'Peanuts') label = '🥜 Peanut';
    else if (allg === 'Soya') label = '🌱 Soya';
    else if (allg === 'Milk') label = '🥛 Milk';
    else if (allg === 'Sesame seeds') label = '🥯 Sesam';
    else if (allg === 'Sulphur dioxide') label = '🍷 Sulph';
    else if (allg === 'Molluscs') label = '🐚 Mollus';
    else if (allg === 'Celery') label = '🌿 Celer';
    else if (allg === 'Mustard') label = '🏺 Must';
    else if (allg === 'Lupin') label = '🌸 Lupin';

    headerHtml += '<th class="col-rotate"><span>' + label + '</span></th>';
  });
  headerHtml += '</tr></thead>';
  
  // Create Body Rows — grouped by category with accordion sections
  const matrixCategoryOrder = [
    'small-bites','chicken','burgers-wraps','specials','sharing-platters',
    'sides','kids','mojitos','mocktails','soft-drinks','desserts','sauces'
  ];
  const matrixGroups = {};
  matrixCategoryOrder.forEach(c => { matrixGroups[c] = []; });
  allergenData.forEach(item => {
    const cat = getItemCategory(item.name);
    if (matrixGroups[cat]) matrixGroups[cat].push(item);
    else matrixGroups['sauces'].push(item);
  });

  const colCount = allergenList.length + 1;
  let bodyHtml = '<tbody>';
  matrixCategoryOrder.forEach(catId => {
    const items = matrixGroups[catId];
    if (items.length === 0) return;
    const meta = categoryMetadata[catId] || { title: catId, icon: '✨' };
    const groupId = 'matrix-group-' + catId;
    // Category header row
    bodyHtml += '<tr class="matrix-category-row" data-group="' + groupId + '">' +
      '<td colspan="' + colCount + '" class="matrix-category-header">' +
      '<span class="matrix-cat-icon">' + meta.icon + '</span>' +
      '<span class="matrix-cat-label">' + meta.title + '</span>' +
      '<span class="matrix-cat-count">(' + items.length + ' items)</span>' +
      '<span class="matrix-cat-chevron">▾</span>' +
      '</td></tr>';
    // Item rows
    items.forEach(item => {
      bodyHtml += '<tr class="matrix-item-row" data-group="' + groupId + '"><td class="dish-name">' + item.name + '</td>';
      allergenList.forEach(allg => {
        const val = item.allergens[allg];
        let cellClass = 'safe';
        if (val === 'Yes') cellClass = 'contains';
        else if (val === 'May') cellClass = 'may';
        bodyHtml += '<td><div class="matrix-cell ' + cellClass + '">' + val + '</div></td>';
      });
      bodyHtml += '</tr>';
    });
  });
  bodyHtml += '</tbody>';
  
  matrixTable.innerHTML = headerHtml + bodyHtml;

  // Wire up matrix accordion toggles
  matrixTable.querySelectorAll('.matrix-category-row').forEach(headerRow => {
    headerRow.addEventListener('click', () => {
      const groupId = headerRow.getAttribute('data-group');
      const isOpen = !headerRow.classList.contains('collapsed');
      const itemRows = matrixTable.querySelectorAll('.matrix-item-row[data-group="' + groupId + '"]');
      const chevron = headerRow.querySelector('.matrix-cat-chevron');
      if (isOpen) {
        headerRow.classList.add('collapsed');
        if (chevron) chevron.textContent = '▸';
        itemRows.forEach(r => { r.style.display = 'none'; });
      } else {
        headerRow.classList.remove('collapsed');
        if (chevron) chevron.textContent = '▾';
        itemRows.forEach(r => { r.style.display = ''; });
      }
    });
  });
}

// Initial Update
updateFinder();
