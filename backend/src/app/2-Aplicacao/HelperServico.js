export class Validator {
    isValidDate(date) {
        if (date == null){
            return false;
        }
        var isDate = Date.parse(new Date(date));

        if (isNaN(isDate) == true){
            return false;
        }
        else{
            return true;
        }
    }

    isValidDuration(durationSeconds){
        console.log("Oi Michael, estou no Validator.isValidDuration()");
        console.log("A duração que recebi foi: ", durationSeconds);
        if (durationSeconds == null){
            return false;
        }
        var isDuration = parseInt(durationSeconds);

        if (isNaN(isDuration) == true){
            return false;
        }
        else{
            return true;
        }
    }
}

export class Convert {
    convertMsToDay(ms) {
        return Math.floor(ms / (1000 * 60 * 60 * 24));   
    }
    convertStringBoolToInt(stringBool){
        if (String(stringBool).toLowerCase() == 'true')
            return 1
        else if (String(stringBool).toLowerCase() == 'false'){
            return 0
        }
        else{
            throw new Error(`O valor '${stringBool}' é inválido. O parâmetro deve ser 'true' ou 'false'.`);
        }
    }
}
