import type { DashboardData } from "../types";

type NoticesPageProps = {
  notices: DashboardData["recentNotices"];
};

function NoticesPage({ notices }: Readonly<NoticesPageProps>) {
  return (
    <section className="incidents-page notices-page">
      <div className="panel-heading">
        <div>
          <h2>Notices & Announcements</h2>
          <p>Publish and manage operational updates.</p>
        </div>
      </div>

      <div className="content-grid">
        <article className="panel">
          <div className="panel-heading">
            <h3>All notices</h3>
            <span className="count-badge">{notices.length}</span>
          </div>

          {notices.length === 0 ? (
            <p className="empty-state">No notices available.</p>
          ) : (
            notices.map((notice) => (
              <div className="notice-row" key={notice.id}>
                <div>
                  <strong>{notice.title}</strong>
                  <p>{notice.body}</p>
                </div>
                <span className="incident-status">Published</span>
              </div>
            ))
          )}
        </article>

        <article className="panel notice-form-panel">
          <h3>Create new notice</h3>
          <p>Share an announcement with your team.</p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label htmlFor="notice-title">Notice title</label>
            <input
              id="notice-title"
              type="text"
              placeholder="e.g. Route diversion on NH-34"
            />

            <label htmlFor="notice-category">Category</label>
            <select id="notice-category" defaultValue="">
              <option value="" disabled>
                Select category
              </option>
              <option value="service-update">Service Update</option>
              <option value="maintenance">Maintenance</option>
              <option value="safety">Safety Alert</option>
              <option value="general">General Announcement</option>
            </select>

            <label htmlFor="notice-priority">Priority</label>
            <select id="notice-priority" defaultValue="normal">
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <label htmlFor="notice-audience">Target audience</label>
            <select id="notice-audience" defaultValue="all">
              <option value="all">All Staff</option>
              <option value="drivers">Drivers</option>
              <option value="operations">Operations Team</option>
              <option value="maintenance">Maintenance Team</option>
            </select>

            <label htmlFor="notice-message">Message</label>
            <textarea
              id="notice-message"
              rows={5}
              placeholder="Write your announcement here..."
            />

            <button type="submit" className="primary-button">
              Publish Notice
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}

export default NoticesPage;
