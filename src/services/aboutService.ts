import { cache } from "react";
import { prisma } from "@/lib/prisma";

/**
 * Elimina parámetros de query de URLs firmadas de almacenamiento
 * (compatibilidad con URLs antiguas de S3 o Supabase signed URLs)
 */
function cleanStorageUrl(url: string | null): string | null {
  if (!url) return null;

  try {
    const urlObj = new URL(url);

    // Limpiar query params de URLs de AWS S3 o Supabase Storage firmadas
    if (urlObj.hostname.includes("amazonaws.com") || urlObj.hostname.includes("supabase.co")) {
      urlObj.search = "";
      return urlObj.toString();
    }

    return url;
  } catch {
    return url;
  }
}

// Alias para compatibilidad interna
const cleanS3Url = cleanStorageUrl;

export const getAboutProfile = cache(async function getAboutProfile(locale: "es" | "en" = "es") {
  try {
    const profile = await prisma.aboutProfile.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!profile) return null;

    // Use translated fields if locale is 'en' and translation exists
    const localizedProfile = {
      ...profile,
      title: locale === "en" && profile.titleEn ? profile.titleEn : profile.title,
      subtitle: locale === "en" && profile.subtitleEn ? profile.subtitleEn : profile.subtitle,
      bio: locale === "en" && profile.bioEn ? profile.bioEn : profile.bio,
      bioHtml: locale === "en" && profile.bioHtmlEn ? profile.bioHtmlEn : profile.bioHtml,
      profileImage: cleanS3Url(profile.profileImage),
    };

    return localizedProfile;
  } catch (error) {
    console.error("Error fetching about profile:", error);
    return null;
  }
});

export const getSkills = cache(async function getSkills() {
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
});

export const getContactInfo = cache(async function getContactInfo() {
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
});

export const getWorkExperience = cache(async function getWorkExperience(
  locale: "es" | "en" = "es"
) {
  try {
    const experience = await prisma.workExperience.findMany({
      orderBy: { order: "asc" },
    });

    // Use translated fields if locale is 'en' and translation exists
    return experience.map(exp => ({
      ...exp,
      position: locale === "en" && exp.positionEn ? exp.positionEn : exp.position,
      description: locale === "en" && exp.descriptionEn ? exp.descriptionEn : exp.description,
      descriptionHtml:
        locale === "en" && exp.descriptionHtmlEn ? exp.descriptionHtmlEn : exp.descriptionHtml,
    }));
  } catch (error) {
    console.error("Error fetching work experience:", error);
    return [];
  }
});

export const getEducation = cache(async function getEducation(locale: "es" | "en" = "es") {
  try {
    const education = await prisma.education.findMany({
      orderBy: { order: "asc" },
    });

    // Use translated fields if locale is 'en' and translation exists
    return education.map(edu => ({
      ...edu,
      degree: locale === "en" && edu.degreeEn ? edu.degreeEn : edu.degree,
      field: locale === "en" && edu.fieldEn ? edu.fieldEn : edu.field,
    }));
  } catch (error) {
    console.error("Error fetching education:", error);
    return [];
  }
});

export const getCourses = cache(async function getCourses(locale: "es" | "en" = "es") {
  try {
    const courses = await prisma.course.findMany({
      orderBy: [{ provider: "asc" }, { order: "asc" }],
    });

    // Clean S3 URLs and apply translations
    const cleanedCourses = courses.map(course => ({
      ...course,
      title: locale === "en" && course.titleEn ? course.titleEn : course.title,
      category: locale === "en" && course.categoryEn ? course.categoryEn : course.category,
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
});
