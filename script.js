

    // Variables globales	
    var cont
    var repet
    var orden
    var n; // nu_elems total
    var m; // tomadosde
    var nrepet = new Array(); // num de repet. de cada uno de los n elems.(PR)
    var model
    var elems = new Array();
    var lista = new Array()
    var monopoly = new Array()



    function tree(level, s) {
        if (level == 1)  // no mas recursividad
        {
            for (var i = 0; i < n; i++) {
                if (s[level][i] > 0) {
                    monopoly[m - level] = i
                    lista[cont++] = monopoly.join(".");

                    //alert("lista con nivel = 1 : "+lista)
                }
            }
        }
        else {
            if (orden == true)  // Variaciones, permutaciones:
            {
                for (var i = 0; i < n; i++) {
                    if (s[level][i] > 0) {
                        monopoly[m - level] = i;
                        for (var k = 0; k < n; k++) { s[level - 1][k] = s[level][k] }
                        //	s[level-1]=s[level]
                        //alert(s)
                        s[level - 1][i]--
                        //alert(s)
                        tree(level - 1, s);
                    }
                }
            }
            else	//  Combinaciones:
            {
                for (var i = 0; i < n; i++) {
                    if (s[level][i] > 0) {
                        if (repet == false && n - i < level)  // evitar el FAIL
                        {  // quedan menos de "level" elementos: no hacer nada
                        }
                        else {
                            monopoly[m - level] = i;
                            for (var k = 0; k < n; k++) { s[level - 1][k] = s[level][k] }
                            //		s[level-1]=s[level]
                            if (repet == false) { apd = i + 1 }
                            else { apd = i }
                            for (var k = 0; k < apd; k++) { s[level - 1][k] = 0 }
                            for (var k = apd; k < n; k++) { s[level - 1][k] = 1 }
                            tree(level - 1, s);
                        }
                    }
                }
            }
        }
    }


    function total() {
        var set = new Array()
        for (var i = 0; i <= m; i++) {
            var entran = new Array()
            for (var k = 0; k < n; k++) { entran[k] = 1 }
            set[i] = entran
        }
        if (model == 2)  // PR
        {
            for (var k = 0; k < n; k++) {
                set[m][k] = nrepet[k]
            }
        }
        if (model == 4 || model == 6)  // VR o CR
        {
            for (var k = 0; k < n; k++) {
                set[m][k] = m + 1
            }
        }
        nivel = m;
        cont = 0;

        tree(nivel, set)

    }

    function genera(form) {
        var correcta = checkInput(form, "genera");
        if (correcta == true) {
            calculate(form)
            if (eval(form.nitemstex.value) < 999999999) {
                genera1(form)
            }
            else {
                alert("Demasiados grupos.")
            }
        }
        else {
            alert("La entrada de datos no es correcta, intentalo de nuevo")
            form.grupostex.value = ""
            form.nitemstex.value = ""
        }
    }

    function genera1(form) {
        cont = 0
        if (model % 2 == 0) { repet = true }
        else { repet = false }
        if (model <= 4) { orden = true }
        else { orden = false }
        total();
        nu_cosas = cont;
        var texto = ""
        var cadena = ""
        for (var i = 0; i < nu_cosas; i++) {
            cosa = lista[i].split(".");
            numero = i + 1
            cadena = numero + ".-"
            for (var j = 0; j < m - 1; j++) {
                cadena = cadena + elems[cosa[j]] + ","
            }
            cadena = cadena + elems[cosa[m - 1]];
            texto = texto + cadena + "\n"
        }
        texto = texto + "====================="
        form.grupostex.value = texto;
    }

    function factorial(num) {
        var aux = 1;
        for (var i = 2; i <= num; i++) { aux *= i };
        return aux
    }
    function variation(num, k) {
        var aux = 1;
        for (var i = 0; i <= k - 1; i++) { aux *= num - i };
        return aux
    }

    function checkInput(form, call) {
        var num = parseInt(form.ntex.value)
        var mt = parseInt(form.mtex.value)
        var cad_numrep = form.nreptex.value
        var cad_elementos = form.elementostex.value
        var correcta = true

        // Se asigna a la variable global "model" el numero del modelo elegido
        model = 0
        for (var i = 0; i < 6; i++) {
            if (form.modelo[i].checked == true) {
                model = i + 1
            }
        }

        // Si se pulsa "Calcular", hay que comprobar "n", o en caso contrario cad_elementos.length 
        if (call == "checkData") {
            if (num > 0) {
                n = num
            }
            else {
                alert("Hay que especificar n")
                correcta = false
            }
        }
        else  // se pulsa "Generar"
        {
            if (cad_elementos.length == 0) {
                alert("Debes introducir los n elementos 'a,b,c,... n'")
                correcta = false
            }
            else {
                elems = cad_elementos.split(",")
                n = elems.length
            }
        }


        // Si son variaciones o combinaciones, se necesita "m"
        if (model == 3 || model == 5) {
            if (mt > 0 && mt <= n) {
                m = mt
            }
            else {
                alert("Hay que especificar m menor o igual que n")
                correcta = false
            }
        }
        // Si son variaciones o combinaciones con repeticion, se necesita "m"
        if (model == 4 || model == 6) {
            if (mt > 0) {
                m = mt
            }
            else {
                alert("Hay que especificar m")
                correcta = false
            }
        }
        // Si son permutaciones ordinarias:
        if (model == 1) { m = n }

        // Caso de las permutaciones con repeticion:
        if (model == 2) {
            if (cad_numrep.length == 0) {
                alert("Tienes que introducir el numero de repeticiones de cada elemento '1,2,3,...'");
                correcta = false
            }
            else {
                var numreparr = new Array();
                numreparr = cad_numrep.split(",")
                if (numreparr.length != n) {
                    alert("Debes introducir el numero de repeticiones de cada uno: '1,2,3,...'")
                    correcta = false
                }
                else {
                    var suma = 0;
                    for (var i = 0; i < n; i++) {
                        nrepet[i] = eval(numreparr[i])
                        suma += nrepet[i]
                    }
                    m = suma
                }
            }
        }
        return correcta
    }

    function checkData(form) {
        var correcta = checkInput(form, "checkData");
        if (correcta == true) {
            calculate(form)
        }
        else {
            alert("La entrada de datos no es correcta, intentalo de nuevo")
            form.nitemstex.value = ""
        }
    }

    function calculate(form) {
        var prod = 1;
        // Voy a borrar los campos que no intervienen en el modelo
        if (model == 1) { form.nreptex.value = ""; form.mtex.value = "" }
        if (model == 2) { form.mtex.value = "" }
        if (model >= 3 && model <= 6) { form.nreptex.value = "" }

        // Vamos con el calculo:
        if (model == 1) {
            prod = factorial(n)
        }
        if (model == 2) {
            prod = factorial(m);
            for (var i = 0; i < n; i++) { prod = prod / factorial(eval(nrepet[i])) }
        }
        if (model == 3) {
            prod = variation(n, m)
        }
        if (model == 4) {
            for (var i = 0; i <= m - 1; i++) { prod = prod * n };
        }
        if (model == 5) {
            prod = variation(n, m) / factorial(m)
        }
        if (model == 6) {
            prod = variation(n + m - 1, m) / factorial(m)
        }

        form.nitemstex.value = prod
    }