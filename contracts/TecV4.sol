// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract TecV4 {
    address private owner;
    // key: sign hashed with SHA256 Algorithm
    // value: User ID at Firebase Firestore Database
    mapping(string => string) writters;
    uint writtersSize;

    // key: certificate string hashed with SHA256 Algorithm
    // value: Student ID at Firebase Firestore Database
    mapping(string => string) certificates;
    uint certificatesSize;

    // Events for testing purposes and logs.
    event addSign(string newSign);
    event addCertificate(string newCertificate);

    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    constructor () {
        owner = msg.sender;
        writtersSize = 0;
        certificatesSize = 0;
    }

    function newWritter(string memory writterSign, string memory userId) public isOwner returns (uint) {
        writters[writterSign] = userId;
        writtersSize = writtersSize + 1;
        emit addSign(writterSign);
        return writtersSize;
    }

    function validateWritter(string memory writterSign, string memory writterId) view public returns (bool) {
        return stringsEqual(writters[writterSign], writterId);
    }

    function newCertificate(
      string memory writterId,
      string memory writterSign,
      string memory certificate,
      string memory studentId
    ) public returns (uint) {
      require (stringsEqual(writters[writterSign], writterId), "Non authorized sign");
      certificates[certificate] = studentId;
      emit addCertificate(certificate);
      certificatesSize = certificatesSize + 1;
      return certificatesSize;
    }

    function validateCertificate(string memory studentId, string memory certificate) public view returns (bool) {
       return stringsEqual(certificates[certificate], studentId);
    }

    // Auxiliar function to compare 2 strings with Solidity.
    function stringsEqual(string memory _a, string memory _b) public pure returns (bool) {
        return keccak256(abi.encodePacked(_a)) == keccak256(abi.encodePacked(_b));
    }
}
