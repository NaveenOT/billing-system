import { useState, useEffect } from "react";
import jsPDFInvoiceTemplate, { OutputType, jsPDF } from "jspdf-invoice-template";
import logo from '../assets/test.jpg';
function Bill(){
   
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
        findTotal();
    }, [billItems]);
    const getItems = async () =>{
        const res = await window.api.getitems();
        setItems(res);
    };
    const addItem = (item) =>{
        const exists = (billItems.find((i) => i.code == item.code))     
        if(!exists){
            setBillItems(
                (prevItems) =>[
                    ...prevItems,
                    {...item, quantity: 1},
                ]
            )
        }
    }
    const findTotal = () =>{
        const tot = billItems.reduce((acc, item)=> acc + (item.price * item.quantity), 0);
        setTotal(tot);

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
        setBillItems((prevItems) =>
            prevItems.map((item) =>
            item.code === code ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };
    const handleQuantityChange = (code, e) =>{
        const quant = e.target.value;
        setBillItems((prevItems)=>{
            prevItems.map((item)=>
                item.code === code ? {...item, quantity: quant } : item
            )
        })
    }
    const decQuant = (code) =>{
        setBillItems((prevItems) =>
            prevItems.map((item)=>
                item.code === code ? {...item, quantity: Math.max(0, item.quantity - 1)} : item 
            ).filter((item)=> item.quantity > 0)
        )
    }
    const generateInvoice = () =>{
        const now = new Date();
        const generateID = (len = 8) => [...Array(len)].map(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 62))).join('');
        const tid = generateID();
        const date = {       
            year: now.getUTCFullYear().toString(),
            day: now.getDay().toLocaleString(),
            month: now.getMonth().toLocaleString(),
            time: now.getHours().toLocaleString() + ": " + now.getMinutes().toLocaleString(),
        };
        const pdf_type = {
            outputType: OutputType.Save,
            returnJsPDFDocObject: true,
            fileName: "Invoice test",
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
                    item.quantity,
                    item.price * item.quantity
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
        alert("Bill Generated", pdf);
    }
    return(
        <>
        <h1 className="text-1xl font-bold underline">Bill</h1>
        <div>
            <input type="text" placeholder="search code or name"
             onChange={handleSearch}
            />
            {showDropdown && 
            (<ul>
                {filtered.map((item, index)=>(
                    <li key={index}  onClick={()=>addItem(item)}>{item.code} | {item.name} |{item.price}</li>
                    ))}
            </ul>)
            }
        </div>
        <div>
            {billItems.length === 0 ? 
                <h3>No Items Added</h3>
                :
                
                <table>
                    <thead>
                        <tr>
                        <th>Serial No.</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {billItems.map((item, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.code}</td>
                         <td>{item.name}</td>
                        <td>{item.price}</td>
                        <td><input type="number" placeholder="Quantity" value={item.quantity} onChange={(e)=>handleQuantityChange(item.code, e)}/></td>
                        <td><button onClick={() => incQuant(item.code)}>+</button><button onClick={() => decQuant(item.code)}>-</button></td>
                    </tr>
                    ))}
                    <tr>
                    <td colSpan={5} >Total: </td>
                    <td>{total}</td>
                    </tr>
                    <tr>
                        <td colSpan={6}><button onClick={generateInvoice}>Confirm Transaction</button></td>
                    </tr>
                    </tbody>
                </table>
            }
        </div>
        </>
    )
}

export default Bill;