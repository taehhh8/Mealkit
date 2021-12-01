data = {
    no: {
        '1': [
            {'value': [290,291,292,293,295,313]},
            {'df': ['소고기', '돼지고시', '닭고기', '생선', '해초','해산물']}
        ], 
        '2': [
            {'value': [290,291,292,293,295,313]},
            {'df': ['소고기', '돼지고시', '닭고기', '생선', '해초','해산물']}
        ]
    }
}
// console.log(data.no['1'][0]) // 1 value
// console.log(data.no['1'][1]) // 1 df
// console.log(Object.keys(data.no["1"]).length)
for (var i=0; i<Object.keys(data.no).length; i++) {
    for (var key in data.no[i]) {
        for (var v in data.no[i][key]) {
            for (var d in data.no[i][key][v]){
                console.log("i: ",i , "\ndata.no : ", data.no, "\nkey: ", data.no[i][key], "\nv: ", data.no[i][key][v], "\nd: ", data.no[i][key][v][d])
            }
        }
    }
}
        
//         for (var j= 0; j<json.jsonData[i][key].length; j++) {
//             console.log(json.jsonData[i][key][j])
//         }
//     }
//  }