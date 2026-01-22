import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import pptxgen from 'pptxgenjs';
import { saveAs } from 'file-saver';

interface Lesson {
    title: string;
    content: string;
}

interface Module {
    title: string;
    lessons: Lesson[];
}

interface Course {
    title: string;
    description: string;
    modules: Module[];
}

export const exportToPDF = (course: Course) => {
    const doc = new jsPDF();
    let y = 20;

    // Title
    doc.setFontSize(22);
    doc.text(course.title, 20, y);
    y += 15;

    // Description
    doc.setFontSize(12);
    const splitDesc = doc.splitTextToSize(course.description, 170);
    doc.text(splitDesc, 20, y);
    y += splitDesc.length * 7 + 10;

    course.modules.forEach((module, mIdx) => {
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(16);
        doc.text(`${mIdx + 1}. ${module.title}`, 20, y);
        y += 10;

        module.lessons.forEach((lesson) => {
            if (y > 250) { doc.addPage(); y = 20; }
            doc.setFontSize(14);
            doc.text(lesson.title, 25, y);
            y += 7;

            doc.setFontSize(10);
            const splitContent = doc.splitTextToSize(lesson.content.replace(/<[^>]*>/g, ''), 160);
            doc.text(splitContent, 25, y);
            y += splitContent.length * 5 + 10;
        });
    });

    doc.save(`${course.title.replace(/\s+/g, '_')}_SkillForge.pdf`);
};

export const exportToWord = async (course: Course) => {
    const sections = [];

    // Title & Header
    sections.push({
        children: [
            new Paragraph({ text: course.title, heading: HeadingLevel.TITLE }),
            new Paragraph({
                children: [
                    new TextRun({ text: "Generado por SkillForge AI Academic", italics: true })
                ]
            }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: course.description }),
            new Paragraph({ text: "" }),
        ],
    });

    course.modules.forEach((module) => {
        const moduleChildren = [
            new Paragraph({ text: module.title, heading: HeadingLevel.HEADING_1 }),
        ];

        module.lessons.forEach((lesson) => {
            moduleChildren.push(new Paragraph({ text: lesson.title, heading: HeadingLevel.HEADING_2 }));
            moduleChildren.push(new Paragraph({ text: lesson.content.replace(/<[^>]*>/g, '') }));
            moduleChildren.push(new Paragraph({ text: "\n" }));
        });

        sections.push({ children: moduleChildren });
    });

    const doc = new Document({ sections });
    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, `${course.title.replace(/\s+/g, '_')}_SkillForge.docx`);
};

export const exportToPPTX = (course: Course) => {
    const pptx = new pptxgen();

    // Intro Slide
    let slide = pptx.addSlide();
    slide.addText(course.title, { x: 1, y: 1.5, w: '80%', fontSize: 44, bold: true, color: '363636', align: 'center' });
    slide.addText(course.description, { x: 1, y: 3, w: '80%', fontSize: 20, color: '666666', align: 'center' });
    slide.addText("Creado por SkillForge AI", { x: 1, y: 5, w: '80%', fontSize: 12, color: '999999', align: 'center' });

    course.modules.forEach((module) => {
        // Module Transition Slide
        let mSlide = pptx.addSlide();
        mSlide.background = { color: 'F3E5F5' };
        mSlide.addText(module.title, { x: 1, y: 2.5, w: '80%', fontSize: 36, bold: true, color: '4A148C', align: 'center' });

        module.lessons.forEach((lesson) => {
            let lSlide = pptx.addSlide();
            lSlide.addText(lesson.title, { x: 0.5, y: 0.5, w: '90%', fontSize: 24, bold: true, color: '311B92' });

            const cleanContent = lesson.content.replace(/<[^>]*>/g, '').substring(0, 1000);
            lSlide.addText(cleanContent, { x: 0.5, y: 1.2, w: '90%', h: '80%', fontSize: 14, color: '424242' });
        });
    });

    pptx.writeFile({ fileName: `${course.title.replace(/\s+/g, '_')}_SkillForge.pptx` });
};
