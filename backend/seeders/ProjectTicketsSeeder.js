// backend/seeders/ProjectTicketsSeeder.js
import ProjectTickets from "../models/ProjectTicketsModel.js";
import Users from "../models/UsersModel.js";

const seedProjectTickets = async () => {
  try {
    // Check if project tickets already exist
    const existingTickets = await ProjectTickets.findAll();
    if (existingTickets.length > 0) {
      console.log("⏭️  Project tickets already exist, skipping seeding...");
      return;
    }

    // Get users for assigning tickets
    const clientUser = await Users.findOne({ 
      where: { email: "client@example.com" }
    });
    const editorUser = await Users.findOne({ 
      where: { email: "editor@example.com" }
    });

    if (!clientUser) {
      console.log("⚠️  Client user not found, cannot seed project tickets");
      return;
    }

    console.log("👤 Found client user:", clientUser.userId, "-", clientUser.email);
    if (editorUser) {
      console.log("👤 Found editor user:", editorUser.userId, "-", editorUser.email);
    }

    // Sample project tickets
    const sampleTickets = [
      {
        clientId: clientUser.userId, // Now using INTEGER userId
        editorId: null,
        subject: "E-commerce Website Development",
        budget: 5000.00,
        description: "Need a modern e-commerce website with payment integration, user authentication, product catalog, and admin panel. The website should be responsive and SEO-optimized.",
        ticketStatus: "OPEN",
        priority: "HIGH",
        projectTitle: "E-commerce Platform for Fashion Store",
        projectStatus: "PENDING",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      {
        clientId: clientUser.userId, // Now using INTEGER userId
        editorId: editorUser ? editorUser.userId : null, // Now using INTEGER userId
        subject: "Mobile App UI/UX Design",
        budget: 3500.00,
        description: "Design a modern and intuitive mobile application interface for a fitness tracking app. Include wireframes, mockups, and interactive prototypes.",
        ticketStatus: editorUser ? "IN_PROGRESS" : "OPEN",
        priority: "MEDIUM",
        projectTitle: "FitTracker Mobile App Design",
        projectStatus: editorUser ? "IN_PROGRESS" : "PENDING",
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        takenAt: editorUser ? new Date() : null,
      },
      {
        clientId: clientUser.userId, // Now using INTEGER userId
        editorId: editorUser ? editorUser.userId : null, // Now using INTEGER userId
        subject: "Company Website Redesign",
        budget: 2800.00,
        description: "Redesign our company website with a modern look and improved user experience. Update content, improve navigation, and make it mobile-friendly.",
        ticketStatus: "RESOLVED",
        priority: "LOW",
        projectTitle: "Corporate Website Redesign",
        projectStatus: "COMPLETED",
        deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        takenAt: editorUser ? new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) : null,
        resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        clientId: clientUser.userId, // Now using INTEGER userId
        editorId: editorUser ? editorUser.userId : null, // Now using INTEGER userId
        subject: "Database Optimization",
        budget: 1500.00,
        description: "Optimize database queries and improve performance for our existing web application. Need to reduce load times and improve scalability.",
        ticketStatus: "IN_PROGRESS",
        priority: "URGENT",
        projectTitle: "Database Performance Enhancement",
        projectStatus: "REVIEW",
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        takenAt: editorUser ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) : null,
      },
      {
        clientId: clientUser.userId, // Now using INTEGER userId
        editorId: null,
        subject: "Social Media Integration",
        budget: 800.00,
        description: "Add social media login and sharing features to our existing platform. Support for Facebook, Google, and Twitter integration.",
        ticketStatus: "OPEN",
        priority: "LOW",
        projectTitle: "Social Media Features Integration",
        projectStatus: "PENDING",
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      }
    ];

    // Create sample tickets
    for (const ticketData of sampleTickets) {
      const createdTicket = await ProjectTickets.create(ticketData);
      console.log(`✅ Created ticket #${createdTicket.projectTicketId}: ${createdTicket.projectTitle}`);
    }

    console.log("✅ Sample project tickets created successfully!");
    console.log(`📊 Created ${sampleTickets.length} sample tickets`);
    
  } catch (error) {
    console.error("❌ Error seeding project tickets:", error.message);
  }
};

export default seedProjectTickets;