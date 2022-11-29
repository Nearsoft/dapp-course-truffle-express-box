// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.25 <0.9.0;

contract TecV4 {
    // address of the owner of the contract. To allow just the contract owner to write on writters mapping.
    address private owner;

    // Writters mapping that stores the ID of writters and sign for them.
    // key: sign hashed with SHA256 Algorithm
    // value: User ID at Firebase Firestore Database
    mapping(string => string) writters;
    
    // writter counter
    uint writtersSize;

    // Certificates mapping to store a raw version of the certificate and the studentId.
    // key: certificate string hashed with SHA256 Algorithm
    // value: Student ID at Firebase Firestore Database
    mapping(string => string) certificates;

    //certificates counter
    uint certificatesSize;

    // Events for testing purposes and logs when we add a new writter and a new certificate.
    event addSign(string newSign);
    event addCertificate(string newCertificate);

    // isOwner functions modifier that checks if the transaction sender address is the same as the contract owner.
    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    // Function that sets the owner address and initialize counters.
    constructor () {
        owner = msg.sender;
        writtersSize = 0;
        certificatesSize = 0;
    }

    // Function that registry a new writter on the writters mapping.
    function newWritter(string memory writterSign, string memory userId) public returns (uint) {
        writters[writterSign] = userId;
        writtersSize = writtersSize + 1;
        emit addSign(writterSign);
        return writtersSize;
    }

    // Function that validate a writter. Checking its appareance on the writters mapping (Key+Value).
    function validateWritter(string memory writterSign, string memory writterId) view public returns (bool) {
        return stringsEqual(writters[writterSign], writterId);
    }


    // Function that add a new certificate to the certificates mapping.
    function newCertificate(
      string memory writterId,
      string memory writterSign,
      string memory certificate,
      string memory studentId
    ) public returns (uint) {
        //First we will check that the writter is authorized to add a new certificate.
      require (stringsEqual(writters[writterSign], writterId), "Non authorized sign");
      certificates[certificate] = studentId;
      emit addCertificate(certificate);
      certificatesSize = certificatesSize + 1;
      return certificatesSize;
    }

    // Function that validate a writter. Checking its appareance on the writters mapping (Key+Value).
    function validateCertificate(string memory studentId, string memory certificate) public view returns (bool) {
       return stringsEqual(certificates[certificate], studentId);
    }

    // Auxiliar function to compare 2 strings with Solidity.
    function stringsEqual(string memory _a, string memory _b) public pure returns (bool) {
        return keccak256(abi.encodePacked(_a)) == keccak256(abi.encodePacked(_b));
    }
}
