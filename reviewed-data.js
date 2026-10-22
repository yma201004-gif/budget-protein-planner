// Reviewed changes layered over the original import and price snapshot.
(function(){
 const replacements={"F002413":"F002414","F005177":"F005184","F007432":"F007433"};
 const nutrients=[
  {
    "id": "F002414",
    "row": 447,
    "sheet": "All solids & liquids per 100 g",
    "values": {
      "Food Name": "Cheese, cheddar, natural, regular fat",
      "Energy with dietary fibre, equated (kJ)": 1686,
      "Protein (g)": 24.6,
      "Fat, total (g)": 33.4,
      "Total dietary fibre (g)": 0,
      "Available carbohydrate, with sugar alcohols (g)": 0.3
    }
  },
  {
    "id": "F005184",
    "row": 760,
    "sheet": "All solids & liquids per 100 g",
    "values": {
      "Food Name": "Lentil, red, hulled, dry",
      "Energy with dietary fibre, equated (kJ)": 1364,
      "Protein (g)": 23,
      "Fat, total (g)": 1.9,
      "Total dietary fibre (g)": 13.7,
      "Available carbohydrate, with sugar alcohols (g)": 45.7
    }
  },
  {
    "id": "F007433",
    "row": 1264,
    "sheet": "All solids & liquids per 100 g",
    "values": {
      "Food Name": "Prawn, flesh, raw (green)",
      "Energy with dietary fibre, equated (kJ)": 381,
      "Protein (g)": 20.7,
      "Fat, total (g)": 0.8,
      "Total dietary fibre (g)": 0,
      "Available carbohydrate, with sugar alcohols (g)": 0
    }
  },
  {
    "id": "F005614",
    "row": 124,
    "sheet": "Liquids only per 100 mL",
    "values": {
      "Food Name": "Milk, cow, fluid, reduced fat (~1%)",
      "Energy with dietary fibre, equated (kJ)": 188,
      "Protein (g)": 3.5,
      "Fat, total (g)": 1.2,
      "Total dietary fibre (g)": 0,
      "Available carbohydrate, with sugar alcohols (g)": 5
    }
  },
  {
    "id": "F005637",
    "row": 126,
    "sheet": "Liquids only per 100 mL",
    "values": {
      "Food Name": "Milk, cow, fluid, skim (~0.15% fat)",
      "Energy with dietary fibre, equated (kJ)": 152,
      "Protein (g)": 3.7,
      "Fat, total (g)": 0,
      "Total dietary fibre (g)": 0,
      "Available carbohydrate, with sugar alcohols (g)": 5.5
    }
  },
  {
    "id": "F008720",
    "row": 165,
    "sheet": "Liquids only per 100 mL",
    "values": {
      "Food Name": "Soy beverage, regular fat (~3%), added Ca & vitamins A, B1, B2 & B12",
      "Energy with dietary fibre, equated (kJ)": 265,
      "Protein (g)": 4.5,
      "Fat, total (g)": 2.8,
      "Total dietary fibre (g)": 0.6,
      "Available carbohydrate, with sugar alcohols (g)": 4.8
    }
  }
];
 window.FOODS=window.FOODS.filter(f=>!["F003705","F009300","F000448","F002880","F007853"].includes(f.id));
 for(const f of window.FOODS){
   const id=replacements[f.id]||f.id,n=nutrients.find(n=>n.id===id);
   f.basis=100;f.nutritionSheet="All solids & liquids per 100 g";f.nutritionSourceType="AFCD";
   if(n){
     const v=n.values;
     Object.assign(f,{id,name:v["Food Name"],protein:v["Protein (g)"],energyKj:v["Energy with dietary fibre, equated (kJ)"],
       kcal:v["Energy with dietary fibre, equated (kJ)"]/4.184,fat:v["Fat, total (g)"],carbs:v["Available carbohydrate, with sugar alcohols (g)"],
       fibre:v["Total dietary fibre (g)"],nutritionRow:n.row,nutritionSheet:n.sheet});
     if(n.sheet.includes("100 mL"))f.unit="mL";
     if(Object.values(replacements).includes(id)){f.detailsRow=n.row;f.offers={};}
   }
 }
 const egg=FOODS.find(f=>f.id==="F003721");
 for(const key of ["protein","kcal","energyKj","fat","carbs","fibre"])egg[key]*=0.5;
 Object.assign(egg,{unit:"egg",basis:1,quality:"Estimate: 50 g edible hard-boiled whole egg per egg. Actual egg size varies; shell excluded.",name:"Egg, whole, hard-boiled (estimated per egg)"});
 const soy=FOODS.find(f=>f.id==="F008720");
 Object.assign(soy,{id:"VITASOY_CALCI",name:"Vitasoy Calci-Plus soy milk",protein:3.2,kcal:64,energyKj:269,fat:3,carbs:5.8,fibre:0.6,
  nutritionSourceType:"Manufacturer",source:"https://soy.com.au/product/soy-milk-calci-plus/",nutritionRow:null,detailsRow:null,
  quality:"Manufacturer nutrition per 100 mL; replaces generic AFCD soy proxy. Check packaging for formulation changes.",offers:{}});
 FOODS.push({id:"COLES_TUNA_95",name:"Coles tuna chunks in olive oil blend, solid portion (95 g can)",category:"Fish",
  unit:"can",basis:1,protein:15.7,kcal:127,energyKj:533,fat:7.1,carbs:0,fibre:0,source:"https://www.coles.com.au/product/8675339",
  nutritionSourceType:"User-supplied packaging",quality:"Packaging photos: one serving per can, solid portion only. Discarded oil excluded. 95 g is net contents, not drained weight. No 70% yield assumption.",offers:{}});
 const mapped={
  "COLES_TUNA_95": {
    "Coles": {
      "id": "coles_8675339",
      "name": "coles tuna chunks in olive oil blend 95g",
      "store": "coles",
      "price": 1.1,
      "currency": "AUD",
      "cup_price": "$11.58/ 1kg",
      "unit_price": 11.58,
      "unit_measure": "kg",
      "uom": "g",
      "weight": 95,
      "url": "https://www.coles.com.au/product/8675339",
      "category": "pantry",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 1
    }
  },
  "F005637": {
    "Coles": {
      "id": "coles_1079800",
      "name": "coles skim milk 2l",
      "store": "coles",
      "price": 3.4,
      "currency": "AUD",
      "cup_price": "$1.70/ 1L",
      "unit_price": 1.7,
      "unit_measure": "l",
      "uom": "l",
      "weight": 2,
      "url": "https://www.coles.com.au/product/1079800",
      "category": "dairy-eggs-fridge",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 2000
    },
    "Woolworths": {
      "id": "woolworths_51379",
      "name": "woolworths skim milk 1l",
      "store": "woolworths",
      "price": 1.75,
      "currency": "AUD",
      "cup_price": "$1.75 / 1L",
      "unit_price": 1.75,
      "unit_measure": "l",
      "uom": "l",
      "weight": 1,
      "url": "https://www.woolworths.com.au/shop/productdetails/51379/woolworths-skim-milk",
      "category": "dairy-eggs-fridge",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 1000
    }
  },
  "VITASOY_CALCI": {
    "Coles": {
      "id": "coles_9067496",
      "name": "vitasoy soy milk calci plus 1l",
      "store": "coles",
      "price": 3.8,
      "currency": "AUD",
      "cup_price": "$3.80/ 1L",
      "unit_price": 3.8,
      "unit_measure": "l",
      "uom": "l",
      "weight": 1,
      "url": "https://www.coles.com.au/product/9067496",
      "category": "dairy-eggs-fridge",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 1000
    },
    "Woolworths": {
      "id": "woolworths_153587",
      "name": "vitasoy calci plus soy milk 1l",
      "store": "woolworths",
      "price": 3.8,
      "currency": "AUD",
      "cup_price": "$3.80 / 1L",
      "unit_price": 3.8,
      "unit_measure": "l",
      "uom": "l",
      "weight": 1,
      "url": "https://www.woolworths.com.au/shop/productdetails/153587/vitasoy-calci-plus-soy-milk",
      "category": "dairy-eggs-fridge",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 1000
    }
  },
  "F003721": {
    "Coles": {
      "id": "coles_9131063",
      "name": "sunrise cage free eggs 12 pack 700g",
      "store": "coles",
      "price": 6.5,
      "currency": "AUD",
      "cup_price": "$0.93/ 100g",
      "unit_price": 0.93,
      "unit_measure": "100g",
      "uom": "pk",
      "weight": 12,
      "url": "https://www.coles.com.au/product/9131063",
      "category": "dairy-eggs-fridge",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 12
    },
    "Woolworths": {
      "id": "woolworths_118213",
      "name": "simply eggs 12 pack extra large cage free eggs 700g",
      "store": "woolworths",
      "price": 6.9,
      "currency": "AUD",
      "cup_price": "$0.99 / 100G",
      "unit_price": 0.99,
      "unit_measure": "100g",
      "uom": "pk",
      "weight": 12,
      "url": "https://www.woolworths.com.au/shop/productdetails/118213/simply-eggs-12-pack-extra-large-cage-free-eggs",
      "category": "dairy-eggs-fridge",
      "out_of_stock": false,
      "is_special": true,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 12
    }
  },
  "F002414": {
    "Coles": {
      "id": "coles_1093903",
      "name": "castello cheddar cheese 200g",
      "store": "coles",
      "price": 8.8,
      "currency": "AUD",
      "cup_price": "$44.00/ 1kg",
      "unit_price": 44,
      "unit_measure": "kg",
      "uom": "g",
      "weight": 200,
      "url": "https://www.coles.com.au/product/1093903",
      "category": "dairy-eggs-fridge",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 200
    },
    "Woolworths": {
      "id": "woolworths_925797",
      "name": "castello mature cheddar cheese 200g",
      "store": "woolworths",
      "price": 8.8,
      "currency": "AUD",
      "cup_price": "$44.00 / 1KG",
      "unit_price": 44,
      "unit_measure": "kg",
      "uom": "g",
      "weight": 200,
      "url": "https://www.woolworths.com.au/shop/productdetails/925797/castello-mature-cheddar-cheese",
      "category": "dairy-eggs-fridge",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 200
    }
  },
  "F007433": {
    "Coles": {
      "id": "coles_3773396",
      "name": "coles prawns raw peeled 260g",
      "store": "coles",
      "price": 12.5,
      "currency": "AUD",
      "cup_price": "$48.08/ 1kg",
      "unit_price": 48.08,
      "unit_measure": "kg",
      "uom": "g",
      "weight": 260,
      "url": "https://www.coles.com.au/product/3773396",
      "category": "meat-seafood",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 260
    },
    "Woolworths": {
      "id": "woolworths_289586",
      "name": "woolworths raw prawn meat 220g",
      "store": "woolworths",
      "price": 10,
      "currency": "AUD",
      "cup_price": "$45.45 / 1KG",
      "unit_price": 45.45,
      "unit_measure": "kg",
      "uom": "g",
      "weight": 220,
      "url": "https://www.woolworths.com.au/shop/productdetails/289586/woolworths-raw-prawn-meat",
      "category": "meat-seafood",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 220
    }
  },
  "F005184": {
    "Coles": {
      "id": "coles_4683608",
      "name": "katoomba red lentils 1kg",
      "store": "coles",
      "price": 4,
      "currency": "AUD",
      "cup_price": "$4.00/ 1kg",
      "unit_price": 4,
      "unit_measure": "kg",
      "uom": "kg",
      "weight": 1,
      "url": "https://www.coles.com.au/product/4683608",
      "category": "pantry",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 1000
    }
  },
  "F006899": {
    "Coles": {
      "id": "coles_2359370",
      "name": "coles pork fillet approx. 400g",
      "store": "coles",
      "price": 7.4,
      "currency": "AUD",
      "cup_price": "$18.50/ 1kg",
      "unit_price": 18.5,
      "unit_measure": "kg",
      "uom": "g",
      "weight": 400,
      "url": "https://www.coles.com.au/product/2359370",
      "category": "meat-seafood",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": 400,
      "estimatedPack": true,
      "unitPrice": 1.85
    }
  },
  "F007827": {
    "Woolworths": {
      "id": "woolworths_126497",
      "name": "fresh tasmanian atlantic salmon fillets per 200g",
      "store": "woolworths",
      "price": null,
      "currency": "AUD",
      "cup_price": "$48.00 / 1KG",
      "unit_price": 48,
      "unit_measure": "kg",
      "uom": "g",
      "weight": 200,
      "url": "https://www.woolworths.com.au/shop/productdetails/126497/fresh-tasmanian-atlantic-salmon-fillets",
      "category": "meat-seafood",
      "out_of_stock": false,
      "is_special": false,
      "updated_at": "2026-10-20T00:00:00.000Z",
      "is_stale": false,
      "region": "AU",
      "pack": null,
      "unitPrice": 4.8
    }
  }
};
 for(const f of FOODS)if(mapped[f.id])f.offers=mapped[f.id];
 const reasons={
 F000448:"Drained weight not verified; nutrition only.",
 F002880:"Drained weight not verified; nutrition only.",
 F007853:"Drained weight not verified; nutrition only.",
 F000386:"Unseasoned, boneless frozen fillet not verified; seasoned and skin-on alternatives not substituted.",
 F005614:"Matching approximately 1% fat milk not verified; 2% and extra-protein alternatives excluded."
 };
 for(const f of FOODS){f.missingReason=reasons[f.id]||f.missingReason||"No matching product for this retailer.";if(mapped[f.id])f.missingReason="No matching product for this retailer.";}
 FOODS.find(f=>f.id==="F005184").quality+=". Dry weight before cooking; canned alternative lacked verified drained weight.";
 const milk=FOODS.find(f=>f.id==="F005614");
 Object.assign(milk,{name:"Devondale Light Milk, 1.3% fat",protein:3.6,energyKj:188,kcal:188/4.184,fat:1.3,carbs:4.6,fibre:null,
   nutritionSourceType:"Coles product nutrition",source:"https://www.coles.com.au/product/devondale-light-milk-3l-1909952",
   nutritionRow:null,detailsRow:null,quality:"Product nutrition per 100 mL, verified for the 3 L pack. Fibre not reported. Not the original generic 1% AFCD record.",
   missingReason:"No matching product for this retailer.",offers:{Coles:{id:"coles_1909952",name:"Devondale Light Milk 3L",price:6.4,pack:3000,
   url:"https://www.coles.com.au/product/devondale-light-milk-3l-1909952",updated_at:"2026-10-20T00:00:00.000Z",source:"WhichGrocer catalogue snapshot",out_of_stock:false,is_stale:false}}});
 const barra=FOODS.find(f=>f.id==="F000386");
 barra.quality="AFCD raw barramundi nutrition estimate, not branded-label values. User-approved assumption: all 300 g is edible boneless flesh. Bone removal is NOT verified; check for bones. Any discarded bones reduce edible yield and change portion-cost estimates.";
 barra.missingReason="No matching product for this retailer.";
 barra.offers={Woolworths:{id:"woolworths_6050189",name:"Humpty Doo Barramundi Portions Skin Off 300g",price:17,pack:300,
   url:"https://www.woolworths.com.au/shop/productdetails/6050189/humpty-doo-barramundi-portions-skin-off",updated_at:"2026-10-20T00:00:00.000Z",
   source:"WhichGrocer catalogue snapshot",out_of_stock:false,is_stale:false,edibleYieldAssumed:true}};
 FOODS.push(...[
  {
    "id": "SUNRICE_LONG_GRAIN",
    "name": "Rice, SunRice long grain white, dry (before cooking)",
    "category": "Cereal",
    "protein": 8,
    "energyKj": 1490,
    "kcal": 356.1185468451243,
    "fat": null,
    "fatNote": "Less than 1 g per 100 g",
    "carbs": 77.4,
    "fibre": 1.1,
    "quality": "Product nutrition per 100 g DRY rice. Weigh before cooking; cooked rice weight is not interchangeable. Fat is reported as less than 1 g, not an exact zero.",
    "unit": "g",
    "basis": 100,
    "source": "https://www.coles.com.au/product/sunrice-premium-long-grain-rice-2kg-296960",
    "nutritionSourceType": "Coles product nutrition",
    "nutritionRow": null,
    "detailsRow": null,
    "missingReason": "No verified matching offer for this retailer.",
    "offers": {
      "Coles": {
        "id": "coles_296960",
        "name": "sunrice premium long grain rice 2kg",
        "store": "coles",
        "price": 4.5,
        "currency": "AUD",
        "cup_price": "$0.23/ 100g",
        "unit_price": 0.23,
        "unit_measure": "100g",
        "uom": "kg",
        "weight": 2,
        "url": "https://www.coles.com.au/product/sunrice-premium-long-grain-rice-2kg-296960",
        "category": "pantry",
        "out_of_stock": false,
        "is_special": false,
        "updated_at": "2026-10-20T00:00:00.000Z",
        "is_stale": false,
        "region": "AU",
        "pack": 2000
      }
    }
  },
  {
    "id": "COLES_BROCCOLI",
    "name": "Broccoli, Coles frozen florets (before cooking)",
    "category": "Vegetables",
    "protein": 4.7,
    "energyKj": 194,
    "kcal": 46.4,
    "fat": 0.9,
    "carbs": 3,
    "fibre": 3.7,
    "quality": "Coles product nutrition per 100 g as sold. Weigh frozen before cooking. Ingredients: 100% broccoli. Cook fully before eating; no cooked-weight yield assumed.",
    "unit": "g",
    "basis": 100,
    "source": "https://www.coles.com.au/product/coles-frozen-broccoli-florets-500g-5341010",
    "nutritionSourceType": "Coles product nutrition",
    "nutritionRow": null,
    "detailsRow": null,
    "missingReason": "No verified matching offer for this retailer.",
    "offers": {
      "Coles": {
        "id": "coles_5341010",
        "name": "coles frozen broccoli florets 500g",
        "store": "coles",
        "price": 4,
        "currency": "AUD",
        "cup_price": "$8.00/ 1kg",
        "unit_price": 8,
        "unit_measure": "kg",
        "uom": "g",
        "weight": 500,
        "url": "https://www.coles.com.au/product/coles-frozen-broccoli-florets-500g-5341010",
        "category": "frozen",
        "out_of_stock": false,
        "is_special": false,
        "updated_at": "2026-10-20T00:00:00.000Z",
        "is_stale": false,
        "region": "AU",
        "pack": 500
      }
    }
  },
  {
    "id": "HELGAS_WHOLEMEAL",
    "name": "Bread, Helga's Traditional Wholemeal",
    "category": "Cereal",
    "protein": 8.1,
    "energyKj": 980,
    "kcal": 234.22562141491395,
    "fat": 2.6,
    "carbs": 40.6,
    "fibre": 5.4,
    "quality": "Product nutrition per 100 g bread as sold. Enter grams; label serving is 83 g (2 slices). Slice weights can vary. Not gluten-free; contains wheat, rye and soy.",
    "unit": "g",
    "basis": 100,
    "source": "https://www.coles.com.au/product/helga%27s-traditional-wholemeal-bread-750g-5969435",
    "nutritionSourceType": "Coles product nutrition",
    "nutritionRow": null,
    "detailsRow": null,
    "missingReason": "No verified matching offer for this retailer.",
    "offers": {
      "Coles": {
        "id": "coles_5969435",
        "name": "helgas traditional wholemeal bread 750g",
        "store": "coles",
        "price": 5.2,
        "currency": "AUD",
        "cup_price": "$0.69/ 100g",
        "unit_price": 0.69,
        "unit_measure": "100g",
        "uom": "g",
        "weight": 750,
        "url": "https://www.coles.com.au/product/helga%27s-traditional-wholemeal-bread-750g-5969435",
        "category": "bakery",
        "out_of_stock": false,
        "is_special": false,
        "updated_at": "2026-10-20T00:00:00.000Z",
        "is_stale": false,
        "region": "AU",
        "pack": 750
      }
    }
  }
]);
 window.REVIEW_META={date:"2026-10-20",note:"Units and food states reviewed. Catalogue snapshots are not live shelf prices. Barramundi edible yield is an explicit assumption. Three canned foods replaced with rice, frozen broccoli and wholemeal bread."};
 const extraOffers=[
  ["SUNRICE_LONG_GRAIN","36502","sunrice-white-rice-premium-long-grain",4.5,2000,"Same product and pack"],
  ["HELGAS_WHOLEMEAL","84129","helga-s-bread-traditional-wholemeal",5.2,750,"Same product and pack"],
  ["COLES_BROCCOLI","768559","woolworths-frozen-australian-broccoli-florets",4,500,"Comparable own-brand products"]
 ];
 for(const [id,sku,slug,price,pack,match] of extraOffers){
   const f=FOODS.find(f=>f.id===id);
   f.comparison=match;
   f.offers.Woolworths={id:"woolworths_"+sku,name:slug.replaceAll("-"," ")+" "+pack+"g",price,pack,
     url:"https://www.woolworths.com.au/shop/productdetails/"+sku+"/"+slug,
     updated_at:"2026-10-20T00:00:00.000Z",out_of_stock:false,is_stale:false,match_type:id==="COLES_BROCCOLI"?"comparable":"exact"};
 }
 const broccoli=FOODS.find(f=>f.id==="COLES_BROCCOLI");
 broccoli.name="Broccoli, frozen florets (before cooking)";
 broccoli.offers.Woolworths.nutrition={protein:2.9,energyKj:101,kcal:101/4.184,fat:1,carbs:1.2,fibre:2.5,
   source:broccoli.offers.Woolworths.url,nutritionSourceType:"Woolworths product nutrition"};
 broccoli.quality="Comparable own-brand frozen broccoli, not identical products. Nutrition follows the selected retailer's label: Woolworths 2.9 g protein and 101 kJ; Coles 4.7 g and 194 kJ per 100 g. Weigh frozen before cooking. Cook fully; no cooked yield assumed. Check packaging for label changes.";

 // Final dual-retailer price completion. Products without a reliable pair were
 // replaced with same-format Coles and Woolworths own-brand protein foods.
 const lentils=FOODS.find(f=>f.id==="F005184");
 Object.assign(lentils,{
   name:"Red split lentils, dry",
   description:"Dry red split lentils, weighed before cooking.",
   quality:"AFCD dry red-lentil nutrition. The exact same Katoomba Ingredients 1 kg product is selected at both retailers. Enter dry weight before cooking; cooked weight is not interchangeable.",
   comparison:"Same Katoomba 1 kg product at both retailers",
   missingReason:"No matching product for this retailer.",
   offers:{
     Woolworths:{id:"woolworths_753947",name:"Katoomba Ingredients Red Lentils 1kg",price:3.5,pack:1000,
       url:"https://www.woolworths.com.au/shop/productdetails/753947/katoomba-ingredients-red-lentils",
       updated_at:"2026-10-20T00:00:00.000Z",source:"WhichGrocer catalogue snapshot",out_of_stock:false,
       is_stale:false,is_special:true,match_type:"exact"},
     Coles:{id:"coles_4683608",name:"Katoomba Red Lentils 1kg",price:4,pack:1000,
       url:"https://www.coles.com.au/product/4683608",updated_at:"2026-10-20T00:00:00.000Z",
       source:"WhichGrocer catalogue snapshot",out_of_stock:false,is_stale:false,match_type:"exact"}
   }
 });

 const milkOwnBrand=FOODS.find(f=>f.id==="F005614");
 Object.assign(milkOwnBrand,{
   name:"Lite milk, 1L (store brand)",
   description:"Fresh reduced-fat cow milk sold in paired Coles and Woolworths 1 L bottles.",
   protein:3.4,energyKj:184,kcal:44,fat:1.25,carbs:4.85,fibre:0.01,
   source:"https://www.coles.com.au/product/1993256",
   nutritionSourceType:"Retailer product labels",
   nutritionRow:null,detailsRow:null,
   quality:"Retailer-specific product nutrition is used per 100 mL: Coles Lite Milk (3.4 g protein, 184 kJ, 1.2 g fat) and Woolworths Lite Milk (3.4 g protein, 189 kJ, 1.3 g fat). Both are 1 L fresh own-brand products. Check packaging for reformulation.",
   comparison:"Paired Coles and Woolworths 1 L light-milk bottles",
   missingReason:"No matching product for this retailer.",
   offers:{
     Woolworths:{id:"woolworths_382737",name:"Woolworths Lite Milk 1L",price:1.75,pack:1000,
       url:"https://www.woolworths.com.au/shop/productdetails/382737/woolworths-lite-milk",
       updated_at:"2026-10-20T00:00:00.000Z",source:"WhichGrocer catalogue snapshot",out_of_stock:false,
       is_stale:false,match_type:"own-brand-pair",
       nutrition:{protein:3.4,energyKj:189,kcal:189/4.184,fat:1.3,carbs:4.9,fibre:null,
         source:"https://www.woolworths.com.au/shop/productdetails/382737/woolworths-lite-milk",
         nutritionSourceType:"Woolworths product nutrition"}},
     Coles:{id:"coles_1993256",name:"Coles Lite Milk Bottle 1L",price:1.75,pack:1000,
       url:"https://www.coles.com.au/product/1993256",updated_at:"2026-10-20T00:00:00.000Z",
       source:"WhichGrocer catalogue snapshot",out_of_stock:false,is_stale:false,match_type:"own-brand-pair",
       nutrition:{protein:3.4,energyKj:184,kcal:44,fat:1.2,carbs:4.8,fibre:0.01,
         source:"https://www.coles.com.au/product/1993256",nutritionSourceType:"Coles product nutrition"}}
   }
 });

 const pork=FOODS.find(f=>f.id==="F006899");
 Object.assign(pork,{
   name:"Pork fillet, lean, raw (sold by weight)",
   description:"Raw lean pork fillet purchased at variable weight.",
   quality:"AFCD lean-pork nutrition proxy. Both offers are retailer own-brand pork fillet sold at $18.50/kg by variable weight, so portion cost is available but the final pack total is not. Trim and fat cover can vary.",
   comparison:"Paired Coles and Woolworths own-brand pork fillet sold by weight",
   missingReason:"No matching product for this retailer.",
   offers:{
     Woolworths:{id:"woolworths_675671",name:"Woolworths Pork Fillet Heart Smart 250g-600g",
       price:null,pack:null,unitPrice:1.85,
       url:"https://www.woolworths.com.au/shop/productdetails/675671/woolworths-pork-fillet-heart-smart",
       updated_at:"2026-10-20T00:00:00.000Z",source:"WhichGrocer catalogue snapshot",out_of_stock:false,
       is_stale:false,variableWeight:true,match_type:"own-brand-pair"},
     Coles:{id:"coles_2359370",name:"Coles Pork Fillet approx. 400g",price:null,pack:null,unitPrice:1.85,
       url:"https://www.coles.com.au/product/2359370",updated_at:"2026-10-20T00:00:00.000Z",
       source:"WhichGrocer catalogue snapshot",out_of_stock:false,is_stale:false,
       variableWeight:true,match_type:"own-brand-pair"}
   }
 });

 const salmon=FOODS.find(f=>f.id==="F007827");
 Object.assign(salmon,{
   name:"Salmon portions, skin off, raw (store brand)",
   description:"Raw Atlantic salmon portions with skin removed, sold as paired 4-pack 460 g store-brand products.",
   quality:"AFCD generic raw-salmon proxy; selected retailer product nutrition is used per 100 g. Both offers are 4-pack 460 g own-brand portions with skin removed. Retail labels differ slightly, so check packaging.",
   comparison:"Paired Coles and Woolworths 4-pack 460 g skin-off salmon portions",
   missingReason:"No matching product for this retailer.",
   offers:{
     Woolworths:{id:"woolworths_157055",name:"Woolworths 4 Pack Salmon Portions Skin Off 460g",price:24,pack:460,
       url:"https://www.woolworths.com.au/shop/productdetails/157055/woolworths-4-pack-salmon-portions-skin-off",
       updated_at:"2026-10-20T00:00:00.000Z",source:"WhichGrocer catalogue snapshot",out_of_stock:false,
       is_stale:false,match_type:"own-brand-pair",
       nutrition:{protein:20.5,energyKj:966,kcal:966/4.184,fat:16.7,carbs:1,fibre:null,
         source:"https://www.woolworths.com.au/shop/productdetails/157055/woolworths-4-pack-salmon-portions-skin-off",
         nutritionSourceType:"Woolworths product nutrition"}},
     Coles:{id:"coles_3613822",name:"Coles Tasmanian Salmon Portions Skin Off 4 Pack 460g",price:24,pack:460,
       url:"https://www.coles.com.au/product/3613822",updated_at:"2026-10-20T00:00:00.000Z",
       source:"WhichGrocer catalogue snapshot",out_of_stock:false,is_stale:false,match_type:"own-brand-pair",
       nutrition:{protein:21,energyKj:968,kcal:968/4.184,fat:16.2,carbs:0.37,fibre:0.6,
         source:"https://www.coles.com.au/product/3613822",nutritionSourceType:"Coles product nutrition"}}
   }
 });

 const tuna=FOODS.find(f=>f.id==="COLES_TUNA_95");
 Object.assign(tuna,{
   id:"STORE_TUNA_95",
   name:"Tuna chunks in olive oil blend, solid portion (95 g can)",
   description:"Paired Coles and Woolworths own-brand 95 g tuna cans.",
   source:"https://www.coles.com.au/product/8675339",
   nutritionSourceType:"Retailer product labels",
   quality:"The selected retailer's can-label nutrition is used. Coles reports 15.7 g protein and 127 kcal per can; Woolworths reports 18.3 g protein and 510 kJ per can. Nutrition is for the labelled serving or solid portion; 95 g net contents is not assumed to be drained weight.",
   comparison:"Paired Coles and Woolworths own-brand 95 g tuna cans",
   missingReason:"No matching product for this retailer.",
   offers:{
     Woolworths:{id:"woolworths_6002820",name:"Woolworths Yellowfin Tuna Chunks in Olive Oil Blend 95g",
       price:2,pack:1,currency:"AUD",url:"https://www.woolworths.com.au/shop/productdetails/6002820/woolworths-yellowfin-tuna-chunks-in-olive-oil-blend",
       updated_at:"2026-10-20T00:00:00.000Z",source:"WhichGrocer catalogue snapshot",out_of_stock:false,
       is_stale:false,match_type:"own-brand-pair",
       nutrition:{protein:18.3,energyKj:510,kcal:510/4.184,fat:5.4,carbs:0.1,fibre:null,
         source:"https://www.woolworths.com.au/shop/productdetails/6002820/woolworths-yellowfin-tuna-chunks-in-olive-oil-blend",
         nutritionSourceType:"Woolworths product nutrition"}},
     Coles:{id:"coles_8675339",name:"Coles Tuna Chunks in Olive Oil Blend 95g",price:1.1,pack:1,
       currency:"AUD",url:"https://www.coles.com.au/product/8675339",updated_at:"2026-10-20T00:00:00.000Z",
       source:"WhichGrocer catalogue snapshot",out_of_stock:false,is_stale:false,match_type:"own-brand-pair",
       nutrition:{protein:15.7,energyKj:533,kcal:127,fat:7.1,carbs:0,fibre:0,
         source:"https://www.coles.com.au/product/8675339",nutritionSourceType:"Coles packaging label"}}
   }
 });

 // Barramundi and turkey lacked stable same-format own-brand pairs. Replace
 // those rows rather than attach unrelated product prices to the old names.
 const beefStrips=FOODS.find(f=>f.id==="F000386");
 Object.assign(beefStrips,{
   id:"F000931",
   name:"Beef stir-fry strips, lean, raw",
   category:"Red meat",
   protein:27.2,energyKj:536,kcal:536/4.184,fat:2,carbs:0,fibre:0,
   source:"https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/data-files",
   nutritionRow:786,detailsRow:786,derivation:"Analysed",
   nutritionSheet:"All solids & liquids per 100 g",nutritionSourceType:"AFCD",
   description:"Raw beef purchased as stir-fry strips and likely to come from various regions of the carcase; lean muscle meat with separable fat removed.",
   quality:"AFCD lean beef stir-fry nutrition. Both selected offers are raw 500 g stir-fry-strip products from the retailers' own ranges. Source cuts, trim and fat content can vary between retailer products.",
   comparison:"Paired Coles and Woolworths own-brand 500 g raw stir-fry beef",
   missingReason:"No matching product for this retailer.",
   offers:{
     Woolworths:{id:"woolworths_175569",name:"Macro Grass Fed Australian Stir-Fry Beef 500g",price:13,pack:500,
       url:"https://www.woolworths.com.au/shop/productdetails/175569/macro-grass-fed-australian-stir-fry-beef",
       updated_at:"2026-10-20T00:00:00.000Z",source:"WhichGrocer catalogue snapshot",out_of_stock:false,
       is_stale:false,match_type:"own-brand-pair"},
     Coles:{id:"coles_9990965",name:"Coles Beef Stir Fry 500g",price:12,pack:500,
       url:"https://www.coles.com.au/product/9990965",updated_at:"2026-10-20T00:00:00.000Z",
       source:"WhichGrocer catalogue snapshot",out_of_stock:false,is_stale:false,
       match_type:"own-brand-pair"}
   }
 });

 const lambSteak=FOODS.find(f=>f.id==="F009307");
 Object.assign(lambSteak,{
   id:"F005013",
   name:"Lamb leg steak, lean, raw",
   category:"Red meat",
   protein:21.1,energyKj:477,kcal:477/4.184,fat:3.2,carbs:0,fibre:0,
   source:"https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/data-files",
   nutritionRow:886,detailsRow:886,derivation:"Analysed",
   nutritionSheet:"All solids & liquids per 100 g",nutritionSourceType:"AFCD",
   description:"Raw lamb from the hind portion of the carcase, sold as a lean leg steak; separable fat removed.",
   quality:"AFCD lean lamb-leg nutrition proxy. Both selected offers are 270 g raw lamb leg steaks from the retailers' own ranges. Exact trim and seam-fat lines can vary; check the pack label if precise fat intake matters.",
   comparison:"Paired Coles and Woolworths own-brand 270 g raw lamb leg steaks",
   missingReason:"No matching product for this retailer.",
   offers:{
     Woolworths:{id:"woolworths_675490",name:"Woolworths Lamb Leg Steak 270g",price:9,pack:270,
       url:"https://www.woolworths.com.au/shop/productdetails/675490/woolworths-lamb-leg-steak",
       updated_at:"2026-10-20T00:00:00.000Z",source:"WhichGrocer catalogue snapshot",out_of_stock:false,
       is_stale:false,match_type:"own-brand-pair"},
     Coles:{id:"coles_3958405",name:"Coles Lamb Leg Steak 270g",price:9,pack:270,
       url:"https://www.coles.com.au/product/3958405",updated_at:"2026-10-20T00:00:00.000Z",
       source:"WhichGrocer catalogue snapshot",out_of_stock:false,is_stale:false,
       match_type:"own-brand-pair"}
   }
 });
 window.REVIEW_META={
   date:"2026-10-21",
   note:"All 24 foods now have selected in-stock prices at both Coles and Woolworths. Barramundi and turkey were replaced because no stable paired own-brand products existed; lentils use the identical Katoomba product at both stores. Catalogue snapshots are not live shelf prices."
 };
})();

