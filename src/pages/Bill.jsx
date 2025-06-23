import { useState, useEffect, useRef } from "react";
import jsPDFInvoiceTemplate, { OutputType, jsPDF } from "jspdf-invoice-template";
import logo from '../assets/test.jpg';
import Swal from "sweetalert2";

import './ButtonStyle.css';
function Bill(){
    const searchRef = useRef(null);
    const [items, setItems] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchItem, setSearchItem] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [billItems, setBillItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(()=>{
        getItems();
    }, []);
    useEffect(()=>{
        const handleClick = (event) =>{
            if(searchRef.current && !searchRef.current.contains(event.target)){
                setShowDropdown(false);
                setSearchItem("");
            }
        };
        document.addEventListener("mousedown", handleClick);
        return ()=> document.removeEventListener("mousedown", handleClick);
    }, [])
   useEffect(() => {
    let hasChange = false;

    const updatedItems = billItems.map((item) => {
        const newSubtotal = parseFloat(item.price) * parseFloat(item.billQuantity);
        const fixedSubtotal = isNaN(newSubtotal) ? 0 : parseFloat(newSubtotal.toFixed(2));

        if (item.subtotal !== fixedSubtotal) {
            hasChange = true;
            return { ...item, subtotal: fixedSubtotal };
        }
        return item;
    });

    if (hasChange) {
        setBillItems(updatedItems);
    }

    const tot = updatedItems.reduce((acc, item) => acc + item.subtotal, 0);
    setTotal(tot.toFixed(2));
}, [billItems]);
    const getItems = async () =>{
            const res = await window.api.getitems();
            setItems(res);
        };
    const findItemStock = (code) =>{
        const found = items.find((item)=> item.code ===  code);
        return found ? found.quantity : 0;
    }
    const addItem = (item) =>{
        const exists = (billItems.find((i) => i.code == item.code))     
        if(!exists){
            if(item.quantity > 0)
            {setBillItems(
                (prevItems) =>[
                    ...prevItems,
                    {...item, billQuantity: 1},
                ]
            )}
            else{
                alert("Item Out of Stock");}
        }
    }
    
    const handleSearch = (e) =>{
        const search = e.target.value;
        setSearchItem(search);
        if(search.trim() == ""){
            setShowDropdown(false);
            setFiltered([]);
            return;
        }
        const filtered_ = items.filter(
            (item) => {
                return (
                item.name.toLowerCase().includes(search.toLowerCase()) || 
                item.code.toString().includes(search.toLowerCase())
                )
            }
            
        )
        setFiltered(filtered_);
        setShowDropdown(filtered_.length > 0);
    }
    const incQuant = (code) => {
        setBillItems((prevItems)=>
            prevItems.map((item)=>{
                const stock = findItemStock(code);
                if(item.code === code){
                    return {...item, billQuantity: Math.min(stock, item.billQuantity + 1)}
                }
                return item;
            })
        )
    };
    const handleQuantityChange = (code, e) =>{
        const quant = parseFloat(e.target.value, 10) || 0;
        const stock = findItemStock(code);
        const newQt = Math.min(stock, quant);
        setBillItems((prevItems)=>
            prevItems.map((item)=>
                item.code === code ? {...item, billQuantity: newQt.toFixed(2) } : item
            )
        )
    }
    const decQuant = (code) => {
        const stock = findItemStock(code);
        setBillItems((prevItems) =>
            prevItems
                .map((item) =>
                    item.code === code
                        ? { ...item, billQuantity: Math.max(0, item.billQuantity - 1) }
                        : item
                )
                .filter((item) => item.billQuantity > 0)
        );
    };
    const confirmTransaction = async () =>{
        const { value: customer } = await Swal.fire(
            {
                title: "Enter Customer Details",
                html: 
                    `<input id="cust-name" placeholder="Customer Name" />` + 
                    `<input id="cust-ph" placeholder="Customer Number" />` + 
                    `<input id="t-type" placeholder="Transaction Type" />` + 
                    `<input id="notes" placeholder="Additional Notes" />`,
                focusConfirm: false,
                showCancelButton: true,
                preConfirm: ()=>{
                    const name = document.getElementById("cust-name").value;
                    const phno = document.getElementById("cust-ph").value;
                    const ttype = document.getElementById("t-type").value;
                    const notes = document.getElementById("notes").value;
                    return {name, phno, ttype, notes};
                }   
            }
        );
        if(customer){
            generateInvoice(customer);
        }
    }
    const generateInvoice = async (transaction) =>{
        const items_json = JSON.stringify(billItems);
        const trans = {
            cust_name: transaction.name,
            phno: transaction.phno,
            ttype: transaction.ttype,
            notes: transaction.notes,
            amount: total,
            items_json: items_json,
        }
        for(let item of billItems){
            const dbitem = items.find((i)=>item.code == i.code);
            const newStock = dbitem.quantity - item.billQuantity;
            dbitem.quantity = newStock;
            const result = await window.api.updateitems(dbitem);
        }
        //(tid, cust_name, phone_no, amount, ttype, notes
      
    await getItems();
    const tid = await window.api.addtransaction(trans);   
//      const generateID = (len = 8) => [...Array(len)].map(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 62))).join('');
//      const tid = generateID();
        const now = new Date();
        const date = {       
            year: now.getUTCFullYear().toString(),
            day: now.getDay().toLocaleString(),
            month: now.getMonth().toLocaleString(),
            time: now.getHours().toLocaleString() + ": " + now.getMinutes().toLocaleString(),
        };

        const pdf_type = {
            outputType: OutputType.Save,
            returnJsPDFDocObject: true,
            fileName: `${transaction.name}-${tid}`,
            orientationLandscape: false,
            compress: true,
            logo: {
                src: logo,
                type: 'JPG',
                width: 53.33,
                height: 26.66,
                margin: {
                    top: 0,
                    left: 0,
                }
            },
            stamp: {
                inAllPages: true,
                src: logo,
                type: 'JPG', 
                width: 20,
                height: 20,
                margin: {
                    top: 0, 
                    left: 0 
                }
            },
            business: {
                name: "AV Traders",
                address: "Address",
                phone: "Number",
                email: "avtraders@gmail.com",
                website: "av.com",
            },
            invoice: {
                label: "Invoice test",
                num: 1,
                invDate: `${date.year}/${date.month}/${date.day} ${date.time}`,
                invGenDate: tid,
                headerBorder: false,
                tableBodyBorder: false,
                header: [
                {
                    title: "#", 
                    style: { 
                    width: 10 
                    } 
                }, 
                { 
                    title: "Name",
                    style: {
                    width: 40,
                    } 
                }, 
                { title: "Price"},
                { title: "Quantity"},
                { title: "Total"}
                ],
                table: billItems.map((item, index) =>([
                    index + 1,
                    item.name,
                    item.price,
                    item.billQuantity,
                    item.price * item.billQuantity
                ])),
                additionalRows: [
                    {
                        col1: `Total: ${total}`,
                        style: {
                            fontSize: 10,
                        }
                    }
                ],
            },
            footer: {
                text: "This Invoice is Computer Generated and is valid without stamp or signature"
            },
            pageEnable: true,
            pageLable: "Page ",
        };
        const pdf = jsPDFInvoiceTemplate(pdf_type);
        alert(`Bill Generated, tid: ${tid}`, pdf);
    }
    const resetBill = () =>{
        setBillItems([])
    }
    return(
        <>        
        <div className="mb-15">
        <div className="text-xl absolute top-[6.5rem] flex flex-col space-y-10 justify-center items-center left-150">
        <h1 className="mr-[12em]">Billing</h1>
            <div ref={searchRef}>
            <div className="flex flex-row font-2xl justify-center items-center  space-x-15 mr-120">
            <label className="text-2xl font-semibold">Enter Here: </label>
            <input type="text" placeholder="Search code or Name"
             onChange={handleSearch}
             className="text-2xl font-semibold p-2 border rounded-2xl" 
            />
            </div>
            {showDropdown && 
            (<ul  className="text-2xl mb-8 bg-white font-semibold mr-[32rem] p-4 border rounded-2xl max-h-86   shadow-2xl">
                <li className="font-bold border-b pb-1 mb-1"> Code |Category| Name | Price | Quantity</li>
                {filtered.map((item, index)=>(
                    <li key={index} className="border-1 rounded-2xl cursor-pointer hover:bg-gray-300 w-80" onClick={()=>addItem(item)}>{item.code} |{item.category}|{item.name} |{item.price}| {item.quantity} </li>
                    ))}
            </ul>)
            }
        </div>
        </div>
        <div>
            {billItems.length === 0 ? 
                <h3 className="text-4xl">No Items Added</h3>
                :
                <div className="mt-80 rounded-lg shadow-lg w-full max-w-6xl">
                <table className="table-auto w-full border border-gray-300 text-center">
                    <thead className="bg-gray-200 text-3xl font-semibold">
                        <tr>
                        <th className="bg-blue-200 p-3 border">Serial No.</th>
                        <th className="p-3 border">Code</th>
                           <th className="p-3 border">Category</th>
                        <th className="p-3 border">Name</th>
                        <th className="p-3 border">Price</th>
                        <th className="p-3 border">Quantity</th>
                        <th className="p-3 border">Subtotal</th>
                        <th className="p-3 border">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {billItems.map((item, index) => (
                    <tr key={index} className="text-2xl font-mono group hover:bg-amber-100">
                        <td className="bg-blue-200 p-3 border text-center group-hover:bg-amber-100">{index + 1}</td>
                        <td className="p-3 border text-center group-hover:bg-amber-100">{item.code}</td>
                        <td className="p-3 border text-center group-hover:bg-amber-100">{item.category}</td>
                         <td className="p-3 border text-center group-hover:bg-amber-100">{item.name}</td>
                        <td className="p-3 border text-center group-hover:bg-amber-100">{item.price}</td>
                        <td className="p-3 border text-center group-hover:bg-amber-100"><input type="text"  className="text-center" min={0} placeholder="Quantity"  value={item.billQuantity}onChange={(e)=>handleQuantityChange(item.code, e)}/></td>
                        <td className="p-3 border text-center group-hover:bg-amber-100">{item.subtotal}</td>
                        <td className="flex flex-row space-x-5 justify-center py-3 items-center border">
                        <button className="inc-button" type="button" onClick={() => incQuant(item.code)} disabled={item.billQuantity >= findItemStock(item.code)}>+</button>
                        <button className="dec-button" onClick={() => decQuant(item.code)}>-</button>
                        
                        </td>
                    </tr>
                    ))}
                    <tr className="bg-amber-100 text-2xl font-semibold border">
                    <td colSpan={5} className="py-3">Total: </td>
                    <td className="py-3 border-2">{total}</td>
                    </tr>
                    <tr>
                        <td colSpan={4} className="text-2xl font-semibold p-4"><button className="reset-button" onClick={resetBill}>Reset Bill</button></td>
                        <td colSpan={4} className="text-2xl font-semibold p-4"><button onClick={confirmTransaction} className="confirm-button">Confirm Transaction</button></td>
                    </tr>
                    </tbody>
                </table>
                </div>
            }
            </div>
            
        </div>
        </>
    )
}

export default Bill;