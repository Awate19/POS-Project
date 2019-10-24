const mongoose=require('mongoose')

const stockschema= new mongoose.Schema(
    {
        category:String,
        item_Name:String,
        Qty:Number
    }
);

const stock=mongoose.model('stock',stockschema)

async function showstore()
{
    const allitems = await stock.find({});
    return allitems;
}

async function addItem(x,y)
{
    const r = await stock.find({category:x,item_Name:y});
    if(r.length != 0) 
    {
        return false
    }
   
    else
    {
        const storeItem = new stock({
            category:x,
            item_Name:y,
            Qty:0
         });
         const result = await storeItem.save();
         return true; 
    }    
}

async function getQty(category,item)
{
    const r = await stock.find({category:category,item_Name:item}); 
    return r
}

async function updateQty(item,Qty2)
{   const r = await stock.find({item_Name:item}); 
    let qty1=r[0].Qty
    let Qty=Number(Qty2)+Number(qty1)
    const updated = await stock.updateOne({
        item_Name : item
      },
      {
        $set :
        {
          Qty:Qty
        }
      })
      return updated
}

async function salesQty(item,Qty2)
{   const r = await stock.find({item_Name:item}); 
    let qty1=r[0].Qty
    let Qty=Number(qty1)-Number(Qty2)
    const updated = await stock.updateOne({
        item_Name : item
      },
      {
        $set :
        {
          Qty:Qty
        }
      })
      return updated
}


module.exports.showstore = showstore;
module.exports.addItem = addItem;
module.exports.getQty = getQty;
module.exports.updateQty = updateQty;
module.exports.salesQty = salesQty;