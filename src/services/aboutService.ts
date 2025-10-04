import { prisma } from "@/lib/prisma";

/**
 * Removes AWS S3 pre-signed URL query parameters
 * Converts pre-signed URLs to public URLs for better caching
 */
function cleanS3Url(url: string | null): string | null {
  if (!url) return null;

  try {
    const urlObj = new URL(url);

    // Check if it's an S3 URL
    if (urlObj.hostname.includes("amazonaws.com")) {
      // Remove all query parameters from S3 URLs
      urlObj.search = "";
      return urlObj.toString();
    }

    return url;
  } catch {
    // If URL parsing fails, return original
    return url;
  }
}

export async function getAboutProfile() {
  try {
    const profile = await prisma.aboutProfile.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!profile) return null;

    // Clean S3 URLs
    return {
      ...profile,
      profileImage: cleanS3Url(profile.profileImage),
    };
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

    // Clean S3 URLs in skill icons
    return skills.map(skill => ({
      ...skill,
      icon: cleanS3Url(skill.icon) || skill.icon,
    }));
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

    // Clean S3 URLs in contact icons
    return contactInfo.map(contact => ({
      ...contact,
      icon: contact.icon ? cleanS3Url(contact.icon) : contact.icon,
    }));
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

    // Clean S3 URLs in course icons
    const cleanedCourses = courses.map(course => ({
      ...course,
      icon: course.icon ? cleanS3Url(course.icon) : course.icon,
      providerIcon: course.providerIcon ? cleanS3Url(course.providerIcon) : course.providerIcon,
    }));

    // Group courses by provider
    const groupedCourses = cleanedCourses.reduce(
      (acc, course) => {
        if (!acc[course.provider]) {
          acc[course.provider] = [];
        }
        acc[course.provider].push(course);
        return acc;
      },
      {} as Record<string, typeof cleanedCourses>
    );

    return groupedCourses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {};
  }
}
