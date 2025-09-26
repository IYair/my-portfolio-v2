import { prisma } from "@/lib/prisma";

export async function getAboutProfile() {
  try {
    const profile = await prisma.aboutProfile.findFirst({
      orderBy: { updatedAt: "desc" },
    });
    return profile;
  } catch (error) {
    console.error("Error fetching about profile:", error);
    return null;
  }
}

export async function getSkills() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: "asc" },
    });
    return skills;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

export async function getContactInfo() {
  try {
    const contactInfo = await prisma.contactInfo.findMany({
      orderBy: { order: "asc" },
    });
    return contactInfo;
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return [];
  }
}

export async function getWorkExperience() {
  try {
    const experience = await prisma.workExperience.findMany({
      orderBy: { order: "asc" },
    });
    return experience;
  } catch (error) {
    console.error("Error fetching work experience:", error);
    return [];
  }
}

export async function getEducation() {
  try {
    const education = await prisma.education.findMany({
      orderBy: { order: "asc" },
    });
    return education;
  } catch (error) {
    console.error("Error fetching education:", error);
    return [];
  }
}

export async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: [{ provider: "asc" }, { order: "asc" }],
    });

    // Group courses by provider
    const groupedCourses = courses.reduce(
      (acc, course) => {
        if (!acc[course.provider]) {
          acc[course.provider] = [];
        }
        acc[course.provider].push(course);
        return acc;
      },
      {} as Record<string, typeof courses>
    );

    return groupedCourses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {};
  }
}
