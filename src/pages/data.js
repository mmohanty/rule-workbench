export const mockServerData = {
  key1: [
    {
      id: "copy-1",
      label: "Loan Application",
      requiresInput: true,
      inputs: ["applicantName", "loanAmount"],
      userInputs: { applicantName: "John Doe", loanAmount: "50000" },
    },
    {
      id: "copy-2",
      label: "Credit Check",
      requiresInput: false,
    },
  ],
  key2: [
    {
      id: "copy-3",
      label: "Income Verification",
      requiresInput: true,
      inputs: ["income", "employmentStatus"],
      userInputs: { income: "75000", employmentStatus: "Full-Time" },
    },
    {
      id: "copy-4",
      label: "Property Assessment",
      requiresInput: true,
      inputs: ["propertyValue", "assessmentDate"],
      userInputs: { propertyValue: "300000", assessmentDate: "2024-03-15" },
    },
  ],
  key3: [
    {
      id: "copy-5",
      label: "Final Approval",
      requiresInput: false,
    },
    {
      id: "copy-6",
      label: "Document Upload",
      requiresInput: true,
      inputs: ["fileType", "uploadedBy"],
      userInputs: { fileType: "PDF", uploadedBy: "Loan Officer" },
    },
  ],
  key4: [
    {
      id: "copy-7",
      label: "Fraud Check",
      requiresInput: false,
    },
  ],
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
  