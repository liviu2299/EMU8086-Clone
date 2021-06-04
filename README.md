# <u>Clona **EMU8086**</u>


## **<u>Descriere</u>**

Acest program isi propune simularea arhitecturii x86 printr-un assembler pe 8 bits care implementeaza un set de instructiuni de baza al acesteia.

<br>

## **<u>Componente</u>**

### Simulator CPU
- Registrii Generali (A, B, C, D)
- Registrul IP
- Flags (Sign, Zero, Carry)
---
### Memorie
- Simulare RAM (256 bits)
- Simulare Stiva (32 bits)
---
### Assembler
- Interpretor instructiuni
---
### UI (Web App)
- Editor cod (Input)
- Vizualizare Registrii
- Vizualizare RAM
- Vizualizare Stiva
- Executie secventiala

<br>
<!-- <img src="/assets/images/sample.png" alt="sample"> -->

![sample1](assets/images/sample.png)
<br>

## **<u>Cum functioneaza</u>**

1) Se traduce codul sursa pe linii cu ajutorul expresiilor regulate (Regex).
2) Codul este impartit in 3 categorii: **Register** / **Number** / **Label**.
3) Pentru fiecare categorie se analizeaza sintaxa si se traduce intr-o structura {type,value} unde type poate fi *register* / *regaddress* / *address* / *number* pentru o catalogare a instructiunilor pe opCode-uri.
4) Instructiuniile si operanzii sunt acum tradusi in opCode-uri si id-uri si copiate in memoria RAM.
5) CPU-ul preia codurile din memorie si executa instructiunile corespunzator fiecarui tip de cod.

<br>

![sample1](assets/images/assembler_diagrama.png)
<br>

## **<u>opCodes</u>**

|Math|Memory|Logic|Test|Jumps|System|
|----|------|-----|----|-----|------|
|ADD |MOV   |AND  |CMP |JMP  |HLT   |
|SUB |PUSH  |OR   |    |JG   |      |
|INC |POP   |SHR  |    |JGE  |      |
|DEC |      |SHL  |    |JL   |      |
|DIV |      |NOT  |    |JLE  |      |
|MUL |      |     |    |JCXZ |      |
|    |      |     |    |JE   |      |
|    |      |     |    |JNE  |      |
|    |      |     |    |LOOP |      |

<br>

## **<u>Demo</u>**


<br>

## **<u>Surse de inspiratie</u>**

Proiect si structura inspirata de: https://github.com/Schweigi/assembler-simulator

Alte surse de inspiratie:
1. https://github.com/msfwebdude/javascript-cpu-simulator
2. https://github.com/parraman/asm-simulator


<br>

## **<u>Documentatie x86</u>**
1. https://www.cs.virginia.edu/~evans/cs216/guides/x86.html#calling
2. https://www.felixcloutier.com/x86/
