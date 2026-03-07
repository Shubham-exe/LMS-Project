import jsPDF from "jspdf";

const generateCertificate = (studentName, courseName) => {

  const doc = new jsPDF("landscape");

  doc.setFont("times", "bold");

  doc.setFontSize(40);
  doc.text("Certificate of Completion", 148, 40, { align: "center" });

  doc.setFontSize(20);
  doc.text("This certifies that", 148, 70, { align: "center" });

  doc.setFontSize(30);
  doc.text(studentName, 148, 90, { align: "center" });

  doc.setFontSize(18);
  doc.text("has successfully completed the course", 148, 110, { align: "center" });

  doc.setFontSize(24);
  doc.text(courseName, 148, 130, { align: "center" });

  doc.setFontSize(14);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 230, 180);

  doc.save(`${courseName}-certificate.pdf`);
};

export default generateCertificate;