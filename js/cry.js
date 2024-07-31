
        const formText = document.querySelector("#formText");
        const response = document.querySelector("#response");
        const expected = "305800b71062b49b350208327a02ec378199b4cf35e60eeb971611bef4928394";

        formText.addEventListener("submit", function(event){
            event.preventDefault();
            
            const text = formText.secret.value;
            
            console.log("1 pegou valor");
            generateHash(text).then(htext => {
                console.log("2 gerou hash:", htext);
                validate(htext);
            });
        });

        async function generateHash(input) {
            const encoder = new TextEncoder();
            const data = encoder.encode(input);
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
            console.log("Hash:", hashHex);
            return hashHex; // Retorna o hash como uma string hexadecimal
        }

        function validate(htext){
            if (htext === expected){
                response.textContent = "Resposta certa";
                envText(htext);
            } else {
                response.textContent = "Resposta errada";
            }
        }

        function env(htext){
            console.log("5 enviando ", htext);
            return fetch (`"https://drive.google.com/file/d/${htext}/view?usp=sharing`)
                .then((envdata) => envdata.json())
                .catch((msgError) => console.log(msgError));
        }

        async function envText(htext){
            try {
                const envdata = await env(htext);
                console.log("4 chamou função async", envdata);
                // Aqui você pode manipular os dados da API
            } catch (msgError){
                alert("ocoreu um erro no server, tente mais tarde");
            }
        }


        function text (text){
            const mytext = text;

            const tt = "eP1oTPo8IdxE4CoN1CnGzxo0H4ROrEn0cqHM/oxksg8=";
            //const letters = tt.split('');
            console.log(tt[0]);
            const aa =  tt[2] + tt[7] + tt[35];

            const rel = "1Q8MmeaCmL1y9IbNj5MOPG4VoXc5VaMch";
            

    
            
           }

    
           text("tulipa")


           async function hashAndEncode(number) {
            // Converter o número para string
            const input = number.toString();
            
            // Gerar um hash SHA-256
            const encoder = new TextEncoder();
            const data = encoder.encode(input);
           
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
           
            // Converter o hash para um array de bytes
            const hashArray = Array.from(new Uint8Array(hashBuffer));
          
            // Converter para string Base64
            const hashBase64 = btoa(String.fromCharCode(...hashArray));
            
            return hashBase64;
        }
        
        hashAndEncode("tulipa").then(console.log);
       