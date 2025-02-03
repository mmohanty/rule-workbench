export const mockServerData = {
    key1: [],
    key2: [],
    key3: [],
  };

  export const initialPool = [
    { id: "pool-1", label: "Loan Application", requiresInput: true, inputs: ["applicantName", "loanAmount"] },
    { id: "pool-2", label: "Credit Check", requiresInput: false },
    { id: "pool-3", label: "Income Verification", requiresInput: true, inputs: ["income", "employmentStatus"] },
    { id: "pool-4", label: "Property Assessment", requiresInput: true, inputs: ["propertyValue", "assessmentDate"] },
    { id: "pool-5", label: "Final Approval", requiresInput: false },
    { id: "pool-6", label: "Document Upload", requiresInput: true, inputs: ["fileType", "uploadedBy"] },
    { id: "pool-7", label: "Fraud Check", requiresInput: false },
  ];
  