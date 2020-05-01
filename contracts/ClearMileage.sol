pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract ClearMileage {
    struct dateKm {
        uint date;
        uint km;
        uint m;
    }
    struct carInfo {
        string matricula;
        dateKm[] kmArray;
        bool exists;
    }
    mapping(address => mapping(string => carInfo)) public cars;
    mapping(string => address) VINtoAdress;
    
    function setCarInfo(string memory matr, uint km, uint m, string memory VIN) public{
        if (cars[msg.sender][VIN].exists) setCarKm(km, m, VIN);
        else{
            require (!cars[VINtoAdress[VIN]][VIN].exists, "Car already exists.");
            cars[msg.sender][VIN].matricula = matr;
            cars[msg.sender][VIN].exists = true;
            VINtoAdress[VIN] = msg.sender;
            setCarKm(km, m, VIN);
        }
    }

    function setCarKm(uint km, uint m, string memory VIN) public{
            dateKm memory temp;
            temp.date = now;
            temp.km = km;
            temp.m = m;
            cars[msg.sender][VIN].kmArray.push(temp);
    }

    function getCarInfo(string memory VIN) public view returns (carInfo memory){
        if (cars[VINtoAdress[VIN]][VIN].exists) return cars[VINtoAdress[VIN]][VIN];
        else {
            carInfo memory error;
            error.matricula = "ERROR. Car doesn't exist";
            error.exists = false;
            return error;
        }
    }

    function changeCarOwner(string memory VIN, address destiny) public{
        require(msg.sender != destiny, "Same sender and destiny.");
        if (cars[msg.sender][VIN].exists) {
            cars[destiny][VIN] = cars[msg.sender][VIN];
            VINtoAdress[VIN] = destiny;
            cars[msg.sender][VIN].exists = false;
        }
    }

    function greet() public view returns (string memory) {
        return "HELLO";
    }
}