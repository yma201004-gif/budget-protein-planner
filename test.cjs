const assert=require("node:assert/strict"),{calculate,offer}=require("./model.js");
const food={id:"a",protein:20,kcal:100,pack:1000,prices:{Woolworths:12,Coles:15}};
let r=calculate([food],{a:200},"Both");
assert.equal(r.protein,40);assert.equal(r.cost,2.4);assert.equal(r.purchase,12);
r=calculate([food],{a:1200},"Both");assert.equal(r.purchase,24);assert.equal(r.lines[0].packs,2);
assert.equal(offer(food,"Coles").price,15);
assert.equal(calculate([food],{},"Both").cost,0);
assert.equal(calculate([{...food,prices:{}}],{a:200},"Both").cost,null);
assert.equal(calculate([food],{a:0},"Both").lines.length,0);
assert.equal(calculate([food],{a:NaN},"Both").lines.length,0);
console.log("8 calculation checks passed.");
const fs=require("node:fs"),vm=require("node:vm"),context={window:{}};
vm.runInNewContext(fs.readFileSync(__dirname+"/data.js","utf8"),context);
const foods=context.window.FOODS;
assert.equal(foods.length,25);
assert.equal(new Set(foods.map(f=>f.id)).size,25);
assert.equal(foods.find(f=>f.id==="F005614").protein,3.3);
assert.equal(foods.filter(f=>f.prices.Woolworths!==null).length,7);
assert.equal(foods.filter(f=>f.prices.Coles!==null).length,0);
for(const f of foods){assert.ok(f.nutritionRow>=4);assert.ok(Number.isFinite(f.protein));assert.ok(Math.abs(f.kcal*4.184-f.energyKj)<1e-8)}
assert.equal(calculate(foods,{F002594:200,F006143:80},"Coles").cost,null);
assert.equal(calculate(foods,{F009300:100},"Both").cost,null);
assert.equal(calculate(foods,{F002594:400},"Both").purchase,8.4);
console.log("Source-data checks and historical/missing-price checks passed.");
vm.runInNewContext(fs.readFileSync(__dirname+"/prices.js","utf8"),context);
assert.equal(foods.filter(f=>offer(f,"Coles")).length,3);
assert.equal(foods.filter(f=>offer(f,"Woolworths")).length,3);
const snapshotMeal=calculate(foods,{F002594:200,F006143:80},"Both");
assert.ok(Math.abs(snapshotMeal.cost-(9.4/650*200+3.5/1800*80))<1e-9);
assert.equal(snapshotMeal.purchase,12.9);
assert.equal(calculate(foods,{F002594:601},"Coles").purchase,22);
assert.equal(calculate(foods,{F002594:601},"Woolworths").purchase,9.4);
assert.equal(calculate(foods,{F000666:100},"Both").cost,null);
assert.equal(offer(foods.find(f=>f.id==="F006143"),"Coles").pack,1800);
for(const f of foods) for(const o of Object.values(f.offers)){
 assert.ok(o.url.startsWith("https://"));assert.ok(o.updated_at);assert.ok(o.pack>0);
}
console.log("WhichGrocer snapshot, retailer-specific packs and withheld legacy prices passed.");
