//###########################Selectors###########################
//Buttons
let modebtn=document.querySelector(".modebtn");
let addproductbtn=document.querySelector(".add");
let resetbtn=document.querySelector(".reset");
let deleteallbtn=document.querySelector(".deleteall");
let deleteone=document.querySelector(".deleteone");
let editone=document.querySelector(".editone");
let addtocart=document.querySelector(".addtocart");
let searchbox=document.querySelector(".searchbox");
let createinvoice=document.querySelector(".createinvoice");
let clearcart=document.querySelector(".clearcart");
let addtoinvoices=document.querySelector(".addtoinvoices");
let deleteinvoice=document.querySelector(".deleteinvoice");
let Viewinvoice=document.querySelector(".Viewinvoice");
let close_btn=document.querySelector(".close-btn");
let printbtn=document.querySelector(".printbtn");
let printall=document.querySelector(".printall");
let deleteAllInvoices=document.querySelector(".deleteAllInvoices");
let ExportInvoices=document.querySelector(".ExportInvoices");
let ExportProducts=document.querySelector(".ExportProducts");
//inputs
let search=document.querySelector(".Search");
let nametxt=document.querySelector("#nametxt");
let price=document.querySelector("#pricetxt");
let quantity=document.querySelector("#quantitytxt");
let Manufacturer=document.querySelector("#qManufacturertxt");
let description=document.querySelector("#pdesc");
let data=document.querySelector("#datainput");
let inputs=document.querySelectorAll(".input");
let Producttable=document.getElementsByClassName("Producttable")[0];
let numberofproducts=document.querySelector(".numberofproducts");
let cart=document.querySelector(".cart");
let alert=document.querySelector(".alert");
let selectionbox=document.querySelector(".selectionbox");
let addQtytoinvoices=document.querySelector(".addQtytoinvoices");
let cartItemsNumber=document.querySelector(".cartitemsnumber h3");
let priceIninvoice=document.querySelector(".priceIninvoice");
let taxinput=document.querySelector(".taxinput");
let discountinput=document.querySelector(".discountinput");
let CustomerTel=document.querySelector(".CustomerTel");
let CustomerName=document.querySelector(".CustomerName");
let Subtotalvalue=document.getElementById("Subtotalvalue");
let totalvalue=document.querySelector("#totalvalue");
let Invoicestable=document.querySelector(".Invoicestable");
let invoice_id=document.querySelector(".invoice_id");
let invoice_items=document.querySelector(".invoice_items");
let invoice_tel=document.querySelector(".invoice_tel");
let invoice_name=document.querySelector(".invoice_name");
let invoice_data=document.querySelector(".invoice_data");
let invoice_body=document.querySelector(".invoice_body");
let invoice_subtotal=document.querySelector(".invoice_subtotal");
let invoice_tax=document.querySelector(".invoice_tax");
let invoice_discount=document.querySelector(".invoice_discount");
let invoice_totalamount=document.querySelector(".invoice_totalamount");
let popup=document.querySelector(".invoice-popup");
let invoice_time=document.querySelector(".invoice_time");
let invoice_alert=document.getElementById("invoice-alert");
let saveinputs=document.getElementsByClassName("saveinputs");
//###########################Variables###########################
let productarray=[];
let invoicearray=[];
let cartItemsArray=[];
let updatebtnmode="0";
let printedInvoice;
let Updateidx=0;
let subtotal=0;
//###########################Storage###########################
function uploadProductsToStorage(){
    localStorage.setItem("products",JSON.stringify(productarray));
}
function uploadInvoicesToStorage(){
    localStorage.setItem("Invoices",JSON.stringify(invoicearray));
}
function loadProductsFromStorage(){
    productarray=JSON.parse(localStorage.getItem("products"))||[];
}
function loadInvoicesFromStorage(){
    invoicearray=JSON.parse(localStorage.getItem("Invoices"))||[];
}
//###########################Functions###########################
function getCurrentDateTime() {
    let now = new Date();
    let day = now.getDate();
    let month = now.getMonth() + 1; 
    let year = now.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let currentTime = `${hours}:${minutes} ${ampm}`;
    return { currentDate, currentTime };
}
function createNewId(length = 7) {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    let year=new Date().getFullYear();
    return `INV-${year}-${result}`;
}
function validatePhoneNumber(phone) {
    const phoneStr = phone.toString();
    const phoneRegex = /^01\d{9}$/;
    return phoneRegex.test(phoneStr);
}
window.addEventListener("load",()=>{
    loadInvoicesFromStorage();
    loadProductsFromStorage();
    showProducts();
    showInvoices();
    let newdiv=document.createElement("div");
    newdiv.setAttribute("id","invoice-alert");
    document.body.appendChild(newdiv);

    if(updatebtnmode==="1") addproductbtn.innerText='Update';
    showCartItems();
});
function updatePriceInInvoice(subtotal){
    let tax = parseFloat(taxinput?.value) || 10;
    let discount = parseFloat(discountinput?.value) || 0;
    let taxValue = subtotal * (tax / 100);
    let total = subtotal + taxValue - discount;
    document.getElementById("totalvalue").innerHTML=total;
    document.getElementById("Subtotalvalue").innerHTML=subtotal;
    taxinput = document.querySelector(".taxinput");
    discountinput = document.querySelector(".discountinput");

    taxinput.addEventListener("input", ()=>updatePriceInInvoice(subtotal));
    discountinput.addEventListener("input", ()=>updatePriceInInvoice(subtotal));
}
function showalert(txt1,color){
    if(txt1) alert.innerHTML=`<p>${txt1}</p>`;
    alert.style.backgroundColor=color;
    alert.classList.add("show");
    setTimeout(() => {
        alert.classList.remove("show"); 
    }, 1000);
}
function showinvlicealert(txt1,time,txt2){
    if(txt1) invoice_alert.innerHTML=`<p>${txt1}</p>`;
    if(txt2){
        invoice_alert.innerHTML += `<p>${txt2}</p>`;
    }
    invoice_alert.classList.add("show");
    setTimeout(() => {
       invoice_alert.classList.remove("show"); 
    }, 4000);
}
function showselectionbox(){
    selectionbox.innerHTML='<option value="-1">-- Select Products --</option>';
    for(let i=0;i<productarray.length;i++){
        let newOption=document.createElement("option");
        newOption.innerHTML= `${productarray[i].productname}` ;
        newOption.setAttribute("value",i);
        selectionbox.appendChild(newOption);        
    }
}
function searchInCartArray(name){
    let idx=cartItemsArray.findIndex(ele =>ele.productname===name);
    return idx;
}
function appendThisProductToTable(i){
    let newTr=document.createElement("tr");
       newTr.innerHTML=`
       <td style="flex-wrap: wrap;text-align: center;">${productarray[i].productname}</td>
       <td style="text-align:center;">${productarray[i].productdata}</td>
       <td style="text-align: center;">${productarray[i].productquantity > 0 ? productarray[i].productquantity : '<span style="color:red;">Out Of Stock</span>'}</td>
       <td style="text-align: center;">${productarray[i].productprice}</td>
       <td style="text-align: center;">${productarray[i].productmanufacturer}</td>
       <td>
        <div class="Productbuttons">
          <button onclick="addproducttocart(${i})" id="${i}" title="Add to Cart" class="addtocart"><i class="fa-solid fa-plus"></i></button>
          <button onclick="editproduct(${i})" id="${i}" class="editone">Edit</button>
          <button onclick="deleteproduct(${i})" id="${i}" class="deleteone">Delete</button>
        </div>
       </td>
    `;
    if(productarray[i].expired){
          newTr.classList.add("expired");
    }
    Producttable.appendChild(newTr);
}
function showProducts(searchboxvalue=""){
    let displayedCount = 0;
    Producttable.innerHTML = "";
    for(let i=0;i<productarray.length;i++){
       if(productarray[i].productname.toLowerCase().includes(searchboxvalue)){
           appendThisProductToTable(i);
           displayedCount++;
       }
    }
    numberofproducts.innerHTML=`Total: ${productarray.length} | Showing: ${displayedCount}`;
    showselectionbox();
}    

inputs.forEach(ele => {
    ele.addEventListener("blur", () => {
        if(ele.value.length!=0)ele.style.border = "1px solid black";
    });
});

function resetInputs(){
    inputs.forEach(ele=>{
        ele.value="";
    })
}
addproductbtn.addEventListener("click", () => {
    if(nametxt.value.length > 0 &&price.value.length > 0 &&quantity.value.length > 0 &&Manufacturer.value.length > 0 &&data.value.length > 0&&price.value>0&&quantity.value>=0){
    let inputDate = new Date(data.value); 
    let today = new Date();
    let IsItNew=true;
       if(addproductbtn.innerText==='Update'){
         IsItNew=false;
         productarray[Updateidx]={
         productname:nametxt.value,
         productdata:data.value,
         productprice:price.value,
         productquantity:quantity.value,
         productmanufacturer:Manufacturer.value,
         expired:inputDate < today,
        };
        addproductbtn.innerText='Add Product';
        updatebtnmode="0";
        let index=searchInCartArray(productarray[Updateidx].productname);
        if(index>=0){
          let txt1=null,txt2=null;
          if(cartItemsArray[index].productprice!=productarray[Updateidx].productprice){
              txt1=`Product price updated: ${productarray[Updateidx].productname} from ${cartItemsArray[index].productprice} to ${productarray[Updateidx].productprice}`;
              cartItemsArray[index].productprice=productarray[Updateidx].productprice;
          } 
          if(parseInt(cartItemsArray[index].productquantity)>parseInt(productarray[Updateidx].productquantity)){
              txt2=`Requested quantity for [${productarray[Updateidx].productname}] exceeds stock. Adjusted to ${productarray[Updateidx].productquantity} `;
              cartItemsArray[index].productquantity=productarray[Updateidx].productquantity;
          }
          if(txt1||txt2) {
            showinvlicealert(txt1,4000,txt2);
            if(cartItemsArray[index].productquantity==="0") cartItemsArray.splice(index,1);
            showCartItems();
          }
        }
       }
       else{
        productarray.push({
         productname:nametxt.value,
         productdata:data.value,
         productprice:price.value,
         productquantity:quantity.value,
         productmanufacturer:Manufacturer.value,
         expired:inputDate < today,
        });
       }
       showProducts();
       uploadProductsToStorage();
       resetInputs();
       if(IsItNew) showalert("Product Add successfully","lightgreen");
       else showalert("Product Updated successfully","lightgreen");
    } 
    else {
        inputs.forEach(ele => {
         if (ele.value.length === 0 && ele.id !== "pdesc") {
           ele.style.border = "2px solid red";
         }
         if(ele.id==="pricetxt"&&ele.value<=0) ele.style.border = "2px solid red";
         if(ele.id==="quantitytxt"&&ele.value<0) ele.style.border = "2px solid red";
        });
    }
});
deleteallbtn.addEventListener("click",()=>{
    productarray=[];
    showProducts();
    uploadProductsToStorage();
});
resetbtn.addEventListener("click",()=>{
    resetInputs();
});
function showCartItems(){
    subtotal=0;
    cart.innerHTML="";
    for(let i=0;i<cartItemsArray.length;i++){
        let newCartItem=document.createElement("div");
        newCartItem.innerHTML=`
          <div class="cart-item">
             <div class="item-left">
               <h4 class="item-name">${cartItemsArray[i].productname}</h4>
               <div class="item-details">
               <span class="qty">Quantity:${cartItemsArray[i].productquantity}</span>
               <span class="total">Total price:${cartItemsArray[i].productprice*cartItemsArray[i].productquantity}</span>
          </div>
          </div>
             <div class="item-right">
                <button onclick="minusone(${i})" id="${i}" class="btn decrease"><i class="fa-solid fa-minus"></i></button>
                <button onclick="plusone(${i})" id="${i}" class="btn increase"><i class="fa-solid fa-plus"></i></button>
                <button onclick="removeone(${i})" id="${i}" class="btn remove"><i class="fa-solid fa-trash"></i></button>
             </div>
          </div>`;
        subtotal+=cartItemsArray[i].productprice*cartItemsArray[i].productquantity;
        cart.appendChild(newCartItem);
    }
    cartItemsNumber.innerHTML=`Cart Items: ${cartItemsArray.length}`;
    updatePriceInInvoice(subtotal);

}
function addproducttocart(idx,qty=1){
    if(productarray[idx].expired) showalert("This is Expired!","var(--danger)");
    else{
        let index=searchInCartArray(productarray[idx].productname);
        if(productarray[idx].productquantity<=0){
           showalert("Out Of Stock","var(--danger)");
        }
        else if(index>=0){
           if(cartItemsArray[index].productquantity+1>productarray[idx].productquantity) showalert("There is not Enough Quantity","var(--danger)");
           else{
              cartItemsArray[index].productquantity++;
              showCartItems();
           }
        }
        else{
           cartItemsArray.push({
           productname:productarray[idx].productname,
           productprice:productarray[idx].productprice,
           productquantity:qty,
        })
        showCartItems();
       }
   }
}
close_btn.addEventListener("click",()=>{
    popup.classList.add("disable");
})
function editproduct(idx){
    updatebtnmode="1";
    Updateidx=idx;
    nametxt.value = productarray[idx].productname;
    data.value = productarray[idx].productdata;
    price.value = productarray[idx].productprice;
    quantity.value = productarray[idx].productquantity;
    Manufacturer.value = productarray[idx].productmanufacturer;
    addproductbtn.innerText = "Update";
}

function deleteproduct(idx){
    productarray.splice(idx,1);
    resetInputs();
    showProducts(searchbox.value.toLowerCase()||"");
    uploadProductsToStorage();
}

searchbox.addEventListener("keyup",()=>{
    let searchboxvalue=searchbox.value.toLowerCase();
    showProducts(searchboxvalue);
});
modebtn.addEventListener("click",()=>{ 
    document.documentElement.classList.toggle("dark");
    if(document.documentElement.classList.contains("dark")){
        modebtn.innerHTML=`
            <i style="color:#0f1720" class="fa-regular fa-sun"></i>
            <P class="mode">Light</P>
        `;
    }
    else{
        modebtn.innerHTML=`
            <i style="color:gold" class="fa-solid fa-moon"></i>
            <P class="mode">Night</P>
        `;
    }
});
function plusone(i){
    let idx = productarray.findIndex(obj => obj.productname === cartItemsArray[i].productname);
    if(cartItemsArray[i].productquantity+1<=productarray[idx].productquantity){
        cartItemsArray[i].productquantity++;
        showCartItems();
    }
    else{
        showalert("There is no enough Quantity in Stock","var(--danger)")
    }

}
function minusone(i){
   if(cartItemsArray[i].productquantity===1){
    removeone(i);
   }
   else{
    cartItemsArray[i].productquantity--;
    showCartItems();
   }
}
function removeone(i){
    cartItemsArray.splice(i,1);
    showCartItems();
}
clearcart.addEventListener("click",()=>{
    document.querySelector(".cart").innerHTML="";
    showselectionbox();
    addQtytoinvoices.value="";
    selectionbox.style.border = `1px solid black`;
    addQtytoinvoices.style.border = `1px solid black`;
    cartItemsArray=[];
    CustomerName.value='';
    CustomerTel.value="";
    showCartItems();
})
addtoinvoices.addEventListener("click", () => {
    let selectedValue = Number(selectionbox.value);
    let qtyValue = Number(addQtytoinvoices.value);
    if (selectedValue === -1 || !qtyValue || qtyValue === 0)
    {
        if (selectedValue === -1) selectionbox.style.border = `2px solid red`;
        if (!qtyValue || qtyValue === 0) addQtytoinvoices.style.border = `2px solid red`;
    } 
    else if(productarray[selectedValue].expired) showalert("This is Expired"); 
    else {
        let index=searchInCartArray(productarray[selectedValue].productname);
        if (parseInt(productarray[selectedValue].productquantity) < qtyValue) {
            showalert("There is no enough Quantity in Stock", "var(--danger)");
        }
        else if(index>=0){
            if(cartItemsArray[index].productquantity+qtyValue>productarray[selectedValue].productquantity) showalert("There is Not Enought Quantity");
            else{
                cartItemsArray[index].productquantity+=qtyValue;
                showCartItems();
                addQtytoinvoices.value = "";
                selectionbox.style.border = `1px solid black`;
                addQtytoinvoices.style.border = `1px solid black`;
            }
        }
        else {
            addproducttocart(selectedValue, qtyValue);
            addQtytoinvoices.value = "";
            selectionbox.style.border = `1px solid black`;
            addQtytoinvoices.style.border = `1px solid black`;
        }
    }
    if(!(!qtyValue || qtyValue === 0)) addQtytoinvoices.style.border = `1px solid black`;
    if(!(selectedValue === -1)) selectionbox.style.border = `1px solid black`;
});
function veiwinvoicefunc(idx){
   invoice_body.innerHTML=` `;
   invoice_id.innerHTML=`<strong>Invoice ID:</strong> ${invoicearray[idx].id}`;
   invoice_data.innerHTML=`<strong>Date:</strong>${invoicearray[idx].data}`;
   invoice_name.innerHTML=`<strong>Customer:</strong>${invoicearray[idx].customername}`;
   invoice_tel.innerHTML=`<strong>Customer Tel:</strong>${invoicearray[idx].CustomerTel}`;
   invoice_items.innerHTML=`<strong>Items:</strong> ${invoicearray[idx].items}`;
   invoice_time.innerHTML=`<strong>Time:</strong> ${invoicearray[idx].time}`;
   for(let i=0;i<invoicearray[idx].products.length;i++){
     let newTr=document.createElement("tr");
     newTr.innerHTML=`
      <tr>
        <td>${invoicearray[idx].products[i].productname}</td>
        <td>${invoicearray[idx].products[i].productquantity}</td>
        <td>${invoicearray[idx].products[i].producttotalprice/invoicearray[idx].products[i].productquantity}</td>
        <td>${invoicearray[idx].products[i].producttotalprice}</td>
      </tr>`;
      invoice_body.appendChild(newTr);
   };
   invoice_subtotal.innerHTML=invoicearray[idx].subtotal;
   invoice_tax.innerHTML=invoicearray[idx].tax;   
   invoice_discount.innerHTML=invoicearray[idx].discount;   
   invoice_totalamount.innerHTML=invoicearray[idx].total;
   popup.classList.remove("disable");
}

function showInvoices(){
    Invoicestable.innerHTML="";
    for(let i=0;i<invoicearray.length;i++){
        let newTr=document.createElement("tr");
        newTr.innerHTML=`
        <tr>
            <td>${i+1}</td>
            <td>${invoicearray[i].id}</td>
            <td display=""block>
               <p>${invoicearray[i].data}</p>
               <p>${invoicearray[i].time}</p>
            </td>
            <td>${invoicearray[i].customername}</td>
            <td>${invoicearray[i].items}</td>
            <td>${invoicearray[i].total}</td>
            <td>
               <div class="actions">
                  <button onclick="veiwinvoicefunc(${i})" id=${i} class="Viewinvoice">View</button>
                   <button onclick="deleteinvoicefunc(${i})" id=${i} class="deleteinvoice">Delete</button>
               </div>
            </td>
        </tr>`;
        Invoicestable.appendChild(newTr);
    }
}
createinvoice.addEventListener("click",()=>{
    if(cartItemsArray.length===0) showalert("Cart Is Empty","var(--danger)");
    else if(CustomerTel.value.length>0&&!validatePhoneNumber(CustomerTel.value)){
        CustomerTel.style.border="2px red solid";
    }
    else{
        CustomerTel.style.border="1px black solid";
        let idx;
        let currentinvoicearray=[];
        for(let i=0;i<cartItemsArray.length;i++){
           currentinvoicearray.push({
             productname:cartItemsArray[i].productname,
             productquantity:cartItemsArray[i].productquantity,
             producttotalprice:cartItemsArray[i].productquantity*cartItemsArray[i].productprice,
           });
           let idx = productarray.findIndex(obj => obj.productname === cartItemsArray[i].productname);
           productarray[idx].productquantity-=cartItemsArray[i].productquantity;
        };
        invoicearray.push({
            products:currentinvoicearray,
            customername:CustomerName.value?CustomerName.value:"Unkown",
            CustomerTel:CustomerTel.value?CustomerTel.value:"Unkown",
            items:currentinvoicearray.length,
            total:totalvalue.innerHTML,
            subtotal:Subtotalvalue.innerHTML,
            discount:discountinput.value||0 ,
            tax:taxinput.value||10,
            data:getCurrentDateTime().currentDate,
            time:getCurrentDateTime().currentTime,
            id:createNewId(),
        }) 
        clearcart.click();
        uploadInvoicesToStorage();
        uploadProductsToStorage();
        showProducts();
        showInvoices();
        showalert("Invoive Saved","lightgreen");
    }
})
function deleteinvoicefunc(i){
    invoicearray.splice(i,1);
    showInvoices();
    uploadInvoicesToStorage();
}
printbtn.addEventListener("click", () => { 
  popup.classList.add("printactive");
  window.print();
  popup.classList.remove("printactive");
});
printall.addEventListener("click",()=>{
    let allInvoices=document.createElement("div");
    allInvoices.innerHTML=``;
    for(let i=0;i<invoicearray.length;i++){
        let newbody=document.createElement("tbody");
        for(let j=0;j<invoicearray[i].products.length;j++){
          let newTr=document.createElement("tr");
          newTr.innerHTML=`
             <td>${invoicearray[i].products[j].productname}</td>
             <td>${invoicearray[i].products[j].productquantity}</td>
             <td>${invoicearray[i].products[j].producttotalprice/invoicearray[i].products[j].productquantity}</td>
             <td>${invoicearray[i].products[j].producttotalprice}</td>`;
           newbody.appendChild(newTr);
        };
        let newDiv=document.createElement("div");
        newDiv.innerHTML=`
          <div class="invoice-header">
             <h2>Invoice Details</h2>
             <button class="close-btn">Close ✖</button>
          </div>
          <div class="invoice-info">
          <p class="invoice_id"><strong>Invoice ID:</strong> ${invoicearray[i].id}</p>
          <p class="invoice_data"><strong>Date:</strong> ${invoicearray[i].data}</p>
          <p class="invoice_time"><strong>Time:</strong> ${invoicearray[i].time}</p>
          <p class="invoice_name"><strong>Customer:</strong> ${invoicearray[i].customername}</p>
          <p class="invoice_tel"><strong>Customer Tel:</strong> ${invoicearray[i].CustomerTel}</p>
          <p class="invoice_items"><strong>Items:</strong> ${invoicearray[i].items}</p>
          </div>
          <table class="invoice-items">
          <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
          </thead>
          <tbody class="invoice_body">
            ${newbody.innerHTML};
          </tbody>
          <tfoot>
           <tr>
             <td colspan="3" class="label">Subtotal</td>
             <td class="invoice_subtotal">${invoicearray[i].subtotal}</td>
           </tr>
           <tr>
             <td colspan="3" class="label">Tax</td>
             <td class="invoice_tax">${invoicearray[i].tax}</td>
           </tr>
           <tr>
             <td colspan="3" class="label">Discount</td>
             <td class="invoice_discount">${invoicearray[i].discount}</td>
           </tr>
           <tr class="total-row">
              <td colspan="3"><strong>Total Amount</strong></td>
              <td class="invoice_totalamount"><strong>${invoicearray[i].total}</strong></td>
           </tr>
          </tfoot>
        </table>
        <button style="display: block;margin: 10px auto 0 auto;" class="printbtn">Print Invoice</button>
       </div>`;
     allInvoices.appendChild(newDiv);
    }
    document.body.appendChild(allInvoices);
    allInvoices.classList.add("printactive");
    window.print();
    allInvoices.classList.add("printactive");
    allInvoices.classList.add("disable");
})
deleteAllInvoices.addEventListener("click",()=>{
    invoicearray=[];
    showInvoices();
    uploadInvoicesToStorage();
})
function html_table_to_excel(table, type, name,col) {
    var data = document.getElementById(table);
    var file = XLSX.utils.table_to_book(data, { sheet: 'sheet 1' });
    XLSX.write(file, { bookType: type, bookSST: true, type: 'base64' });
    let colArray=[];
    for(let i=0;i<col;i++){
       colArray.push({wch:20});
    }
    let filename = `${name}_${getCurrentDateTime().currentDate}||${getCurrentDateTime().currentTime}`;
    file.Sheets["sheet 1"]["!cols"] = colArray;
    XLSX.writeFile(file, filename+ "." + type);
}

ExportProducts.addEventListener("click", () => {
    let newtable = document.createElement("table");

    let headerTr = document.createElement("tr");
    headerTr.innerHTML = `
      <td>Name</td>
      <td>Expiry Date</td>
      <td>Quantity</td>
      <td>Price</td>
      <td>Manufacturer</td>
    `;
    newtable.appendChild(headerTr);

    for (let i = 0; i < productarray.length; i++) {
        let newTr = document.createElement("tr");
        newTr.innerHTML = `
            <td>${productarray[i].productname}</td>
            <td>${productarray[i].productdata}</td>
            <td>${productarray[i].productquantity}</td>
            <td>${productarray[i].productprice}</td>
            <td>${productarray[i].productmanufacturer}</td>
        `;
        newtable.appendChild(newTr);
    }

    newtable.setAttribute("id", "printedProductTable");
    newtable.classList.add("disable");

    document.body.appendChild(newtable);

    html_table_to_excel("printedProductTable", "xlsx", "Products Sheet",5);

    document.getElementById("printedProductTable").remove();
});
ExportInvoices.addEventListener("click", () => {
    let newtable = document.createElement("table");

    let headerTr = document.createElement("tr");
    headerTr.innerHTML = `
      <td>NO.</td>
      <td>Invoice_Id</td>
      <td>Date</td>
      <td>Time</td>
      <td>Customer Name</td>
      <td>Customer Phone</td>
      <td>Items</td>
      <td>SubTotal</td>
      <td>Tax(%)</td>
      <td>Discount</td>
      <td>Total</td>
    `;
    newtable.appendChild(headerTr);

    for (let i = 0; i < invoicearray.length; i++) {
        let newTr = document.createElement("tr");
        newTr.innerHTML = `
            <td>${i + 1}</td>
            <td>${invoicearray[i].id}</td>
            <td>${invoicearray[i].data}</td>
            <td>${invoicearray[i].time}</td>
            <td>${invoicearray[i].customername}</td>
            <td>'${String(invoicearray[i].CustomerTel)}</td>
            <td>${invoicearray[i].items}</td>
            <td>${invoicearray[i].subtotal}</td>
            <td>${invoicearray[i].tax}</td>
            <td>${invoicearray[i].discount}</td>
            <td>${invoicearray[i].total}</td>
        `;
        newtable.appendChild(newTr);
    }

    newtable.setAttribute("id", "printedInvoicesTable");
    newtable.classList.add("disable");

    document.body.appendChild(newtable);

    html_table_to_excel("printedInvoicesTable", "xlsx", "Invoices Sheet", 11);

    document.getElementById("printedInvoicesTable").remove();
});







