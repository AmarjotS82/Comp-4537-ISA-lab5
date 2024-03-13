class Button{
    constructor(id,text,textColor,backgroundColor,width, height, x, y,onClickFun ){
        this.btn = document.createElement("button");
        this.btn .id = id
        this.btn .textContent = text
        this.btn .style.color = textColor
        this.btn .style.backgroundColor = backgroundColor
        this.btn .style.width = width  + "em"
        this.btn .style.height = height + "em"
        this.btn .style.left = x + "vw"
        this.btn .style.top = y  + "vh"
        this.btn .onclick = () => onClickFun()
        document.body.appendChild(this.btn);
    }
}

class ownQueryButton extends Button {
    constructor(id,text,textColor,backgroundColor,width, height, x, y,onClickFun){
        super(id,text,textColor,backgroundColor,width, height, x, y,onClickFun)
    }
}

class defaultQueryButton extends Button {
    constructor(id,text,textColor,backgroundColor,width, height, x, y,onClickFun ){
        super(id,text,textColor,backgroundColor,width, height, x, y,onClickFun)
    }
}

class errorMessageParagraph{
    constructor(){
      this.para = document.createElement("p");
      this.para.id = "error"
      this.para.textContent = ""
      document.body.appendChild(this.para);
  }
}

function sendDefault(){
    console.log("Sending default")
    if(document.querySelector("#table")){
        document.getElementById("table").remove()
    }
    const xhr = new XMLHttpRequest();
    let query = `INSERT INTO patient (name, dateOfBirth) VALUES 
    ('Sara Brown', '1991-01-01'),
    ('Jhon Smith', '1941-01-01'),
    ('Jack Ma', '1961-01-30'),
    ('Elon Musk', '1999-01-01');`

    xhr.open("POST", "https://isa-lab5-backend.vercel.app/execInsert", true)
    xhr.setRequestHeader("Content-Type", "application/json")
      xhr.onreadystatechange = () =>{
          if (xhr.readyState === 4){
              if(xhr.status == 200){
                const JSONObj = JSON.parse(xhr.response)
                console.log(JSONObj)
                let msg = JSONObj["message"]
                document.getElementById("error").textContent = msg 
              }
          } else{
              document.getElementById("error").textContent = queryErrorMessage
          }
      }
      
      xhr.send(JSON.stringify({
        query: query,
      }))
}
    


function sendOwn(){
    console.log("Sending own")
    if(document.querySelector("#table")){
        document.getElementById("table").remove()
    }
    
    const xhr = new XMLHttpRequest();


    const query = document.getElementById("textarea").value
    console.log("Executing: " + query);
    let firstWord = query.trim().split(" ")[0];
    if(firstWord.toLowerCase().includes("select")){
        console.log("As GET");
        xhr.open("GET", "https://isa-lab5-backend.vercel.app/sql?query=" + query, true)
            xhr.send()
            xhr.onreadystatechange = () =>{
                console.log(xhr.readyState)
                if (xhr.readyState === 4){
                    if(xhr.status == 200){
                        const JSONObj = JSON.parse(xhr.response)
                        console.log(JSONObj)
                        console.log("s: " + JSONObj["success"])
                        console.log(JSONObj["queryResponse"])
                        let queryResult = JSONObj["queryResult"]
                        let message = JSONObj["queryMessage"]
                        if (queryResult){
                            let table = new responseTable()
                           let headings  = []
                            if(queryResult[0].patientid){
                                headings.push(patientIdHeaading)
                            }
                            if(queryResult[0].name){
                                headings.push(nameHeaading)
                            }
                             if(queryResult[0].dateofbirth){
                                headings.push(dobHeaading)
                            }
                            table.create_headings(headings)
                            queryResult.forEach(row => {
                                let rowinfo = []
                                console.log("Getting row")
                                if(row.patientid){
                                    rowinfo.push(row.patientid.substring(0, 11))
                                }
                                if(row.name){
                                    rowinfo.push(row.name)
                                }
                                if(row.dateofbirth){
                                    rowinfo.push(row.dateofbirth.substring(0, 10))
                                }
                                console.log(row.patientid)
                                console.log(row.name)
                                console.log(row.dateofbirth)
                                table.add_row(rowinfo)
                            });
                            table.add_table_to_page()
                        }
                        document.getElementById("error").textContent = message
                        
                    }
                } else{
                    document.getElementById("error").textContent = serverErrorMessage  + xhr.status;
                }
            }
    }else if(firstWord.toLowerCase().includes("insert")){
        console.log("As POST");
        xhr.open("POST", "https://isa-lab5-backend.vercel.app/execInsert", true)
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.onreadystatechange = () =>{
            if (xhr.readyState === 4){
                if(xhr.status == 200){
                    const JSONObj = JSON.parse(xhr.response)
                    console.log(JSONObj)
                    let msg = JSONObj["message"]
                    document.getElementById("error").textContent = msg 
                }
            } else{
                document.getElementById("error").textContent = queryErrorMessage
            }
        }
        
        xhr.send(JSON.stringify({
            query: query,
        }))
    }else{
        console.log("As POST");
        xhr.open("POST", "https://isa-lab5-backend.vercel.app/execInsert", true)
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.onreadystatechange = () =>{
            if (xhr.readyState === 4){
                if(xhr.status == 200){
                    const JSONObj = JSON.parse(xhr.response)
                    console.log(JSONObj)
                    let msg = JSONObj["message"]
                    let customized_msg  = msg.replace("test4", "")
                    document.getElementById("error").textContent = customized_msg 
                }
            } else{
                document.getElementById("error").textContent = queryErrorMessage
            }
        }
        
        xhr.send(JSON.stringify({
            query: query,
        }))
    }
       
}

class TextArea{
    constructor(){
        this.textArea = document.createElement("textarea")
        this.textArea.id = "textarea"
        
        this.textArea.placeholder = testArea_Placeholder
        this.textArea.style.backgroundColor = "skyblue"
        this.textArea.style.width = 15 + "em"
        this.textArea.style.height = 5 + "em"
        document.body.appendChild(this.textArea)
    }
}


class responseTable{
    constructor(){
        this.table = document.createElement("table");
        this.table.id = "table"
        this.create_body()
    }

    create_headings(headings) {
        let table_head = document.createElement("thead");
        let table_row = document.createElement("tr");
        headings.forEach(heading =>{
            let table_heading = document.createElement("th");
            table_heading.textContent = heading;
            table_row.appendChild(table_heading);
        })
        table_head.appendChild(table_row);
        this.table.appendChild(table_head);
    }

    create_body(){
        this.table_body = document.createElement("tbody");
        
    }

    add_row(rowData){
        let table_row = document.createElement("tr");
        rowData.forEach(data => {
            let col_data = document.createElement("td");
            col_data.textContent = data;
            table_row.appendChild(col_data);
        });
        this.table_body.appendChild(table_row);
        this.table.appendChild(this.table_body);
    }

    add_table_to_page(){
        document.body.appendChild(this.table)
    }
}


let br = document.createElement("br")
let defaultBtn = new defaultQueryButton("defaultQuery", defaultBtnDesc, "white", "brown", 4,2,50,50,sendDefault);
document.body.appendChild(br)
let textarea = new TextArea()

let ownBtn = new ownQueryButton("ownQuery", submitBtnDesc, "black", "yellow", 4,2,80,80,sendOwn)

let para = new errorMessageParagraph()