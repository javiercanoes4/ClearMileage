pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract ClearMileage {
    struct dateKm {
        uint date;
        uint km;
    }
    struct carInfo {
        string matricula;
        dateKm[] kmArray;
        bool exists;
    }
    mapping(address => carInfo) public cars;
    
    function setCarInfo(string memory m, uint k) public{
        if (cars[msg.sender].exists) setCarKm(k);
        else{
            cars[msg.sender].matricula = m;
            cars[msg.sender].exists = true;
            setCarKm(k);
        }
    }

    function setCarKm(uint k) public{
            dateKm memory temp;
            temp.date = now;
            temp.km = k;
            cars[msg.sender].kmArray.push(temp);
    }

    function getCarInfo(address wallet) public view returns (carInfo memory){
        return cars[wallet];
    }
}