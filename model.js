(function(root){
  function offer(food, retailer){
    const names=retailer==="Both"?["Woolworths","Coles"]:[retailer];
    return names.map(r=>({retailer:r,...(food.offers ? food.offers[r] : {price:food.prices[r],pack:food.pack})}))
      .map(o=>({...o,unitPrice:o.unitPrice??(o.pack>0&&Number.isFinite(o.price)&&o.price>0?o.price/o.pack*(food.basis||100):null)}))
      .filter(o=>Number.isFinite(o.unitPrice)&&o.unitPrice>0&&!o.out_of_stock&&!o.is_stale)
      .sort((a,b)=>a.unitPrice-b.unitPrice)[0]||null;
  }
  function calculate(foods,meal,retailer){
    let protein=0,kcal=0,cost=0,purchase=0,missing=false,purchaseMissing=false,estimatedPurchase=false;
    const lines=Object.entries(meal).filter(([,g])=>Number.isFinite(g)&&g>0).map(([id,g])=>{
      const food=foods.find(f=>f.id===id);if(!food)throw Error("Unknown food");
      const basis=food.basis||100,selected=offer(food,retailer),p=food.protein*g/basis;
      protein+=p;kcal+=food.kcal*g/basis;
      const portion=selected?selected.unitPrice*g/basis:null;
      const packs=selected&&selected.pack>0&&Number.isFinite(selected.price)&&selected.price>0?Math.ceil(g/selected.pack):null;
      if(selected)cost+=portion;else missing=true;
      if(packs!==null)purchase+=packs*selected.price;else purchaseMissing=true;
      if(selected?.estimatedPack)estimatedPurchase=true;
      return {food,g,selected,protein:p,portion,packs};
    });
    return {lines,protein,kcal,cost:missing?null:cost,purchase:purchaseMissing?null:purchase,knownCost:cost,missing,purchaseMissing,estimatedPurchase};
  }
  const api={offer,calculate};if(typeof module!=="undefined")module.exports=api;root.Planner=api;
})(typeof window!=="undefined"?window:globalThis);
